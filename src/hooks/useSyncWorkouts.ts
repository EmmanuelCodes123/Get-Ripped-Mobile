import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useWorkoutStore } from "../store/useWorkoutStore";

export const useSyncWorkouts = () => {
  const {
    workouts,
    deletedIds,
    confirmDeletion,
    setSyncStatus,
    setUserWorkouts,
  } = useWorkoutStore();

  const syncEverything = useCallback(async () => {
    // 1. Verify User Session First
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return; // Do nothing if not logged in

    // --- STEP A: PULL FROM CLOUD (The missing piece) ---
    try {
      const { data: remoteData, error: pullError } = await supabase
        .from("workouts")
        .select(`*, exercises (*)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (pullError) throw pullError;

      if (remoteData) {
        // Map Database types (Integers) back to Local State types (Strings)
        const formattedRemoteWorkouts = remoteData.map((w: any) => ({
          ...w,
          rounds: w.rounds?.toString() || "1",
          is_synced: true, // Data from DB is officially synced
          exercises: w.exercises
            ?.sort((a: any, b: any) => a.order_index - b.order_index) // Keep correct order
            .map((ex: any) => ({
              ...ex,
              sets: ex.sets?.toString() || "3",
              reps: ex.reps?.toString() || "",
              time: ex.time?.toString() || "",
              rest: ex.rest?.toString() || "60",
            })),
        }));

        // Merge Strategy: Keep local workouts that haven't been pushed yet,
        // and combine them with the fresh data from Supabase.
        const pendingLocalWorkouts = workouts.filter((w) => !w.is_synced);

        // Update the Zustand store!
        if (setUserWorkouts) {
          setUserWorkouts([
            ...formattedRemoteWorkouts,
            ...pendingLocalWorkouts,
          ]);
        }
      }
    } catch (err) {
      console.error("Cloud pull failed:", err);
    }

    // --- STEP B: SYNC DELETIONS ---
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

    // --- STEP C: PUSH NEW/UPDATED WORKOUTS ---
    const pending = workouts.filter((w) => !w.is_synced);
    for (const workout of pending) {
      try {
        const { error: wError } = await supabase.from("workouts").upsert({
          id: workout.id,
          user_id: workout.user_id,
          name: workout.name,
          rounds: parseInt(workout.rounds) || 1,
          categories: workout.categories,
          created_at: workout.created_at,
        });

        if (wError) throw wError;

        const exercisesToSync = workout.exercises.map((ex) => ({
          id: ex.id,
          workout_id: workout.id,
          name: ex.name,
          reps_mode: ex.reps_mode,
          sets: parseInt(ex.sets) || 3,
          reps: ex.reps ? parseInt(ex.reps) : null,
          time: ex.time ? parseInt(ex.time) : null,
          rest: parseInt(ex.rest) || 60,
          order_index: ex.order_index,
        }));

        const { error: eError } = await supabase
          .from("exercises")
          .upsert(exercisesToSync);

        if (eError) throw eError;

        setSyncStatus(workout.id, true);
        console.log(`Cloud sync: Pushed workout ${workout.id}`);
      } catch (err) {
        console.error("Sync upload failed:", err);
      }
    }
  }, [workouts, deletedIds, confirmDeletion, setSyncStatus, setUserWorkouts]);

  // Trigger sync on network reconnection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        syncEverything();
      }
    });

    return () => unsubscribe();
  }, [syncEverything]);

  // Trigger sync when app loads or data changes
  useEffect(() => {
    syncEverything();
  }, [syncEverything]);
};
