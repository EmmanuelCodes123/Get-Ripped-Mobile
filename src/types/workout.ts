export interface Exercise {
  id: string;
  workout_id: string;
  name: string;
  reps_mode: boolean; // true = Reps, false = Time
  sets: string;
  reps: string;
  time: string;
  rest: string;
  order_index: number;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  rounds: string;
  categories: string[];
  exercises: Exercise[];
  created_at: string;
  updated_at?: string;
  is_synced: boolean;
}

export type ExerciseDraft = Omit<
  Exercise,
  "id" | "workout_id" | "order_index"
> & {
  id?: string | number; // Allow temporary numeric IDs from local state
};

export interface WorkoutDraft {
  name: string;
  rounds: string;
  categories: string[];
  exercises: ExerciseDraft[];
}
