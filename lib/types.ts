export type Role = 'admin' | 'student'

export interface Profile {
  id: string
  name: string
  role: Role
  avatar_url: string | null
  created_at: string
}

export interface Program {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface ProgramDay {
  id: string
  program_id: string
  day_number: number
  name: string
  color: string
  created_at: string
}

export interface WeeklyGuideline {
  id: string
  program_id: string
  week_number: number
  sets: string
  intensity: string
}

export type PartType = 'warmup' | 'main' | 'challenge' | 'other'

export interface DayPart {
  id: string
  day_id: string
  order_index: number
  name: string
  part_type: PartType
  notes: string | null
}

export interface Exercise {
  id: string
  name: string
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  muscle_group: string | null
  created_by: string
  created_at: string
}

export interface PartExercise {
  id: string
  part_id: string
  exercise_id: string
  order_index: number
  notes: string | null
  exercise?: Exercise
}

export interface Assignment {
  id: string
  student_id: string
  program_id: string
  start_date: string
  current_week: number
  active: boolean
  created_at: string
  program?: Program
  student?: Profile
}

export interface WorkoutLog {
  id: string
  student_id: string
  part_exercise_id: string
  assignment_id: string
  logged_at: string
  set_number: number
  reps: number | null
  weight_kg: number | null
  notes: string | null
}

// Compostos para UI
export interface DayWithParts extends ProgramDay {
  parts: (DayPart & { exercises: PartExercise[] })[]
}

export interface ProgramWithDays extends Program {
  days: DayWithParts[]
  guidelines: WeeklyGuideline[]
}
