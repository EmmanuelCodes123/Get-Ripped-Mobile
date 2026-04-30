import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Exercise, Workout, WorkoutDraft } from "../types/workout";

interface WorkoutState {
  workouts: Workout[];
  deletedIds: string[];
  addWorkout: (workoutData: WorkoutDraft, userId: string) => void;
  updateWorkout: (id: string, workoutData: WorkoutDraft) => void;
  deleteWorkout: (id: string) => void;
  confirmDeletion: (id: string) => void;
  setSyncStatus: (id: string, status: boolean) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  calculateEstimatedDuration: (workoutId: string) => number | "N/A";
  setUserWorkouts: (workouts: Workout[]) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      deletedIds: [],

      addWorkout: (workoutData, userId) => {
        const workoutId = uuidv4();
        const preparedExercises: Exercise[] = workoutData.exercises.map(
          (ex, index) => ({
            ...ex,
            id: uuidv4(),
            workout_id: workoutId,
            order_index: index,
          }),
        ) as Exercise[];

        const newWorkout: Workout = {
          ...workoutData,
          id: workoutId,
          user_id: userId,
          exercises: preparedExercises,
          created_at: new Date().toISOString(),
          is_synced: false,
        };

        set((state) => ({ workouts: [newWorkout, ...state.workouts] }));
      },

      updateWorkout: (id, workoutData) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id
              ? {
                  ...w,
                  ...workoutData,
                  exercises: workoutData.exercises.map(
                    (ex: any, index: number) => {
                      // Filter out UI-specific fields before saving
                      const { is_synced, ...exerciseFields } = ex;

                      return {
                        ...exerciseFields,
                        // If it's a real UUID (string > 20 chars), keep it.
                        // If it's a number (temp ID), generate a new UUID.
                        id:
                          typeof ex.id === "string" && ex.id.length > 20
                            ? ex.id
                            : uuidv4(),
                        workout_id: id,
                        order_index: index,
                      };
                    },
                  ) as Exercise[],
                  is_synced: false,
                  updated_at: new Date().toISOString(),
                }
              : w,
          ),
        }));
      },

      setUserWorkouts: (newWorkouts) => {
        set({ workouts: newWorkouts });
      },

      deleteWorkout: (id) => {
        set((state) => ({
          deletedIds: [...state.deletedIds, id],
          workouts: state.workouts.filter((w) => w.id !== id),
        }));
      },

      confirmDeletion: (id) => {
        set((state) => ({
          deletedIds: state.deletedIds.filter((dId) => dId !== id),
        }));
      },

      setSyncStatus: (id, status) => {
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, is_synced: status } : w,
          ),
        }));
      },

      getWorkoutById: (id) => {
        return get().workouts.find((w) => w.id === id);
      },

      calculateEstimatedDuration: (workoutId) => {
        const workout = get().workouts.find((w) => w.id === workoutId);
        if (!workout || workout.exercises.length === 0) return "N/A";

        // If any exercise is "Reps" mode (true), we cannot estimate total time
        const hasRepsMode = workout.exercises.some(
          (ex) => ex.reps_mode === true,
        );
        if (hasRepsMode) return "N/A";

        const totalSeconds = workout.exercises.reduce((total, ex) => {
          const workTime = parseInt(ex.time) || 0;
          const restTime = parseInt(ex.rest) || 0;
          const sets = parseInt(ex.sets) || 1;
          return total + (workTime + restTime) * sets;
        }, 0);

        return totalSeconds;
      },
    }),
    {
      name: "get-ripped-workout-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
