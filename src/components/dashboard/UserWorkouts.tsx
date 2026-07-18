import { getUser } from "@/src/lib/auth";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { useToastStore } from "../../store/useToastStore";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import { WorkoutCard } from "./WorkoutCard";

export const UserWorkouts = () => {
  const { workouts, deleteWorkout } = useWorkoutStore();
  const { showToast } = useToastStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then((user) => setCurrentUser(user));
  }, []);

  // FILTER: Only show workouts belonging to THIS user
  const userSpecificWorkouts = workouts.filter(
    (w) => w.user_id === currentUser?.id,
  );

  const handleDeleteRequest = (id: string, name: string) => {
    Alert.alert(
      "Delete Routine",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteWorkout(id); // 1. Deletes from Zustand
            showToast("Routine Deleted", "info"); // 2. ONLY toast call remains here
          },
        },
      ],
    );
  };

  if (workouts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No routines yet. Time to get ripped!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Routines</Text>
      {userSpecificWorkouts.map((item) => (
        <WorkoutCard
          key={item.id}
          workout={item}
          onDelete={() => handleDeleteRequest(item.id, item.name)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },
  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { color: Colors.textMuted, fontSize: 15, fontWeight: "600" },
});
