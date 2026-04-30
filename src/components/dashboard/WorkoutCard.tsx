import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import { Workout } from "../../types/workout";

interface Props {
  workout: Workout;
  onDelete: (id: string) => void;
}

export const WorkoutCard = ({ workout, onDelete }: Props) => {
  const router = useRouter();
  const handleDelete = () => {
    onDelete(workout.id); // Trigger the Zustand delete (and sync queue)
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.infoContainer}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutStats}>
            {workout.exercises.length} Exercises • {workout.rounds} Rounds
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() =>
              router.push({
                pathname: "/create-workout",
                params: { id: workout.id },
              })
            }
          >
            <FontAwesome5 name="pen" size={12} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircle} onPress={handleDelete}>
            <Ionicons name="trash" size={16} color={Colors.aggressiveRed} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={() => router.push(`/workout-player/${workout.id}` as any)}
      >
        <Text style={styles.startButtonText}>START WORKOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardSurface,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  infoContainer: { flex: 1 },
  workoutName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  workoutStats: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  actionButtons: { flexDirection: "row", gap: 10 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: Colors.primaryGreen,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
