// src/components/Heatmap.tsx
import { addDays, differenceInCalendarDays, eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns'
import { clsx } from 'clsx'

type Props = {
  start: Date
  end: Date
  values: Record<string, boolean> // key: yyyy-MM-dd, value: done
  onToggle: (day: Date) => void
}

export default function Heatmap({ start, end, values, onToggle }: Props) {
  // Build columns by week (Sun..Sat rows)
  const days = eachDayOfInterval({ start, end })
  const weeks: Date[][] = []
  let cursor = startOfWeek(start, { weekStartsOn: 0 })
  while (cursor <= end) {
    const weekEnd = endOfWeek(cursor, { weekStartsOn: 0 })
    const weekDays = eachDayOfInterval({ start: cursor, end: weekEnd }).filter(d => d >= start && d <= end)
    weeks.push(weekDays)
    cursor = addDays(weekEnd, 1)
  }

  const maxSize = 12 // px

  const cellClass = (d: Date) => {
    const key = format(d, 'yyyy-MM-dd')
    const active = !!values[key]
    return clsx('cell', active && 'on')
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 2 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateRows: `repeat(7, ${maxSize}px)`, gap: 2 }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const d = week[i]
              if (!d) return <div key={i} style={{ width: maxSize, height: maxSize }} />
              const title = format(d, 'EEE, MMM d')
              return (
                <div
                  key={i}
                  title={title}
                  onClick={() => onToggle(d)}
                  className={cellClass(d)}
                  style={{ width: maxSize, height: maxSize, cursor: 'pointer', borderRadius: 3, border: '1px solid #e5e7eb' }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <style>{`
        .cell { background: #f3f4f6; }
        .cell.on { background: #10b981; border-color: #059669; }
      `}</style>
    </div>
  )
}