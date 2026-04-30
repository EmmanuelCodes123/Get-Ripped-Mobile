import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useWorkoutStore } from "../store/useWorkoutStore";

export const useSyncWorkouts = () => {
  const { workouts, deletedIds, confirmDeletion, setSyncStatus } =
    useWorkoutStore();

  const syncEverything = async () => {
    // --- STEP A: SYNC DELETIONS FIRST ---
    if (deletedIds.length > 0) {
      for (const id of deletedIds) {
        try {
          const { error } = await supabase
            .from("workouts")
            .delete()
            .eq("id", id);
          if (!error) {
            confirmDeletion(id);
            console.log(`Cloud sync: Deleted workout ${id}`);
          }
        } catch (err) {
          console.error("Failed to sync deletion:", err);
        }
      }
    }

    // --- STEP B: SYNC NEW/UPDATED WORKOUTS ---
    const pending = workouts.filter((w) => !w.is_synced);
    for (const workout of pending) {
      try {
        const { error: wError } = await supabase.from("workouts").upsert({
          id: workout.id,
          user_id: workout.user_id,
          name: workout.name,
          rounds: parseInt(workout.rounds),
          categories: workout.categories,
          created_at: workout.created_at,
        });

        if (wError) throw wError;

        const exercisesToSync = workout.exercises.map((ex) => ({
          id: ex.id,
          workout_id: workout.id,
          name: ex.name,
          reps_mode: ex.reps_mode,
          sets: parseInt(ex.sets),
          reps: ex.reps ? parseInt(ex.reps) : null,
          time: ex.time ? parseInt(ex.time) : null,
          rest: parseInt(ex.rest),
          order_index: ex.order_index,
        }));

        const { error: eError } = await supabase
          .from("exercises")
          .upsert(exercisesToSync);
        if (eError) throw eError;

        setSyncStatus(workout.id, true);
      } catch (err) {
        console.error("Sync upload failed:", err);
      }
    }
  };
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        syncEverything();
      }
    });

    return () => unsubscribe();
  }, [syncEverything]);

  // Sync when data changes
  useEffect(() => {
    syncEverything();
  }, [syncEverything]);
};
