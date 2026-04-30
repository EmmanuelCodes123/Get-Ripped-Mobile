import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseCard } from "../components/create-workout/ExerciseCard";
import { WorkoutHeader } from "../components/create-workout/WorkoutHeader";
import { WorkoutMetadata } from "../components/create-workout/WorkoutMetadata";
import Colors from "../constants/Colors";

import { getUser } from "../lib/auth";
import { useToastStore } from "../store/useToastStore";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { Exercise } from "../types/workout";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CreateWorkout = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string; // Explicitly cast id

  const { addWorkout, updateWorkout, workouts } = useWorkoutStore();
  const { showToast } = useToastStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [workout, setWorkout] = useState({
    name: "",
    rounds: "1",
    categories: ["Full Body"],
    exercises: [
      {
        id: Date.now(),
        name: "",
        repsMode: true,
        sets: "3",
        reps: "12",
        rest: "60",
        time: "30",
      },
    ],
  });

  // 1. Fetch User & Hydrate Data for Editing
  useEffect(() => {
    const init = async () => {
      const user = await getUser();
      if (user) setUserId(user.id);

      // If we have an ID, load that workout's data into state
      if (id) {
        const existing = workouts.find((w) => w.id === id);
        if (existing) {
          setWorkout({
            name: existing.name,
            rounds: existing.rounds,
            categories: existing.categories,
            exercises: existing.exercises.map((ex: any) => ({
              ...ex,
              id: ex.id || Date.now() + Math.random(), // Ensure local state has a unique numeric ID
              repsMode: ex.reps_mode,
            })),
          });
        }
      }
    };
    init();
  }, [id]);

  const toggleCategory = (cat: string) => {
    setWorkout((prev) => {
      const isSelected = prev.categories.includes(cat);
      const newCats = isSelected
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: newCats };
    });
  };

  const updateExercise = (
    id: number,
    field: keyof Exercise, // Ensures 'field' exists on an Exercise
    value: string | boolean | number,
  ) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex,
      ),
    }));
  };
  const addExercise = () => {
    const lastEx = workout.exercises[workout.exercises.length - 1];
    const newEx = {
      id: Date.now(),
      name: "",
      repsMode: lastEx?.repsMode ?? true,
      sets: lastEx?.sets ?? "3",
      reps: lastEx?.reps ?? "12",
      rest: lastEx?.rest ?? "60",
      time: lastEx?.time ?? "30",
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setWorkout((prev) => ({ ...prev, exercises: [...prev.exercises, newEx] }));
  };

  const removeExercise = (id: number) => {
    if (workout.exercises.length > 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setWorkout((prev) => ({
        ...prev,
        exercises: prev.exercises.filter((ex) => ex.id !== id),
      }));
    } else {
      Alert.alert("Action Denied", "Your routine needs at least one exercise.");
    }
  };

  const handleSave = () => {
    if (!workout.name.trim())
      return Alert.alert("Required", "Please name your routine.");
    if (!userId) return Alert.alert("Auth Error", "Verification failed.");

    const formattedData = {
      name: workout.name,
      rounds: workout.rounds,
      categories: workout.categories,
      exercises: workout.exercises.map((ex) => ({
        id: ex.id, // <--- ADD THIS LINE to keep the ID!
        name: ex.name,
        reps_mode: ex.repsMode,
        sets: ex.sets,
        reps: ex.reps,
        time: ex.time,
        rest: ex.rest,
      })),
    };

    if (id) {
      updateWorkout(id, formattedData);
      showToast("Routine Updated!", "success");
    } else {
      addWorkout(formattedData, userId);
      showToast("Successfully created a workout!", "success");
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <WorkoutHeader
        onSave={handleSave}
        onClose={() => router.back()}
        isEditMode={!!id}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <WorkoutMetadata
          name={workout.name}
          setName={(v) => setWorkout((p) => ({ ...p, name: v }))}
          rounds={workout.rounds}
          setRounds={(v) => setWorkout((p) => ({ ...p, rounds: v }))}
          selectedCategories={workout.categories}
          toggleCategory={toggleCategory}
        />
        <Text style={styles.sectionLabel}>EXERCISES</Text>
        {workout.exercises.map((ex, idx) => (
          <ExerciseCard
            key={ex.id}
            index={idx}
            exercise={ex}
            updateExercise={updateExercise}
            removeExercise={removeExercise}
          />
        ))}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addExercise}
          activeOpacity={0.6}
        >
          <Text style={styles.addBtnText}>+ ADD EXERCISE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 60 },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 24,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  addBtn: {
    marginTop: 24,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: Colors.subtleGreen,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  addBtnText: {
    color: Colors.primaryGreen,
    fontWeight: "900",
    letterSpacing: 1,
  },
});

export default CreateWorkout;
