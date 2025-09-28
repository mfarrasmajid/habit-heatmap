// src/api/habits.ts
import { supabase } from '../lib/supabase'
import type { Habit } from '../types'

export async function listHabits(): Promise<Habit[]> {
  const { data, error } = await supabase.from('habits').select('*').order('created_at')
  if (error) throw error
  return data ?? []
}

export async function createHabit(name: string, color?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('habits').insert({
    user_id: user!.id,
    name,
    color: color || '#0ea5e9'
  })
  if (error) throw error
}

export async function deleteHabit(id: string) {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) throw error
}