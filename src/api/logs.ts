// src/api/logs.ts
import { supabase } from '../lib/supabase'

export async function toggleLog(habitId: string, day: string) {
  // If you created the SQL function, call RPC (atomic)
  const { error } = await supabase.rpc('toggle_habit_log', { p_habit_id: habitId, p_day: day })
  if (error) throw error
}

export async function getLogs(habitId: string, start: string, end: string) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('habit_id, day, done')
    .eq('habit_id', habitId)
    .gte('day', start)
    .lte('day', end)
  if (error) throw error
  return data ?? []
}