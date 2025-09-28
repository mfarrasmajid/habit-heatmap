// src/components/Dashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import { format, subWeeks, startOfDay } from 'date-fns'
import { supabase } from '../lib/supabase'
import { listHabits, createHabit, deleteHabit } from '../api/habits'
import { getLogs, toggleLog } from '../api/logs'
import Heatmap from './Heatmap'
import type { Habit } from '../types'

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [logs, setLogs] = useState<Record<string, boolean>>({})

  const end = useMemo(() => startOfDay(new Date()), [])
  const start = useMemo(() => subWeeks(end, 52), [end])

  const refresh = async () => {
    const hs = await listHabits()
    setHabits(hs)
    if (!selected && hs[0]) setSelected(hs[0].id)
  }

  useEffect(() => { refresh() }, [])

  useEffect(() => {
    const load = async () => {
      if (!selected) return
      const data = await getLogs(selected, format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))
      const map: Record<string, boolean> = {}
      data.forEach((r) => { map[r.day] = r.done })
      setLogs(map)
    }
    load()
  }, [selected, start, end])

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    await createHabit(newHabit.trim())
    setNewHabit('')
    refresh()
  }

  const onToggle = async (day: Date) => {
    if (!selected) return
    const d = format(day, 'yyyy-MM-dd')
    await toggleLog(selected, d)
    // optimistic update
    setLogs((prev) => ({ ...prev, [d]: !prev[d] }))
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Habit Heatmap</h2>
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginTop: 16 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {habits.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelected(h.id)}
                style={{
                  padding: '6px 10px',
                  border: selected === h.id ? '2px solid #111' : '1px solid #ccc',
                  background: selected === h.id ? h.color : 'white',
                  color: selected === h.id ? 'white' : '#111',
                  borderRadius: 8
                }}
              >{h.name}</button>
            ))}
          </div>
        </div>
        <form onSubmit={onAdd} style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="New habit (e.g., Read 20min)"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        {selected && (
          <Heatmap
            start={start}
            end={end}
            values={logs}
            onToggle={onToggle}
          />
        )}
      </section>

      {selected && (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={async () => { await deleteHabit(selected); setSelected(null); refresh() }}
            style={{ color: 'crimson' }}
          >Delete selected habit</button>
        </div>
      )}
    </div>
  )
}