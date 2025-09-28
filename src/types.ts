// src/types.ts
export type Habit = { id: string; user_id: string; name: string; color: string }
export type HabitLog = { id: string; habit_id: string; day: string; done: boolean }