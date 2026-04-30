import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import { Exercise } from "../../types/workout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function WorkoutPlayerPreStart() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Store Actions
  const { getWorkoutById, updateWorkout, calculateEstimatedDuration } =
    useWorkoutStore();

  const workout = getWorkoutById(id);

  // Local state to manage smooth reordering independently of store sync
  const [localExercises, setLocalExercises] = useState<Exercise[]>([]);

  // Sync local state when workout loads
  useEffect(() => {
    if (workout?.exercises) {
      setLocalExercises(workout.exercises);
    }
  }, [workout?.exercises]);

  // Calculate duration based on the current order/list
  const estimatedSeconds = useMemo(() => {
    return calculateEstimatedDuration(id);
  }, [id, localExercises]);

  const formattedDuration = useMemo(() => {
    if (estimatedSeconds === "N/A") return "N/A";
    const mins = Math.floor(estimatedSeconds / 60);
    const secs = estimatedSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [estimatedSeconds]);

  // HANDLE REORDER: Update local UI instantly, then sync to store
  const handleReorder = useCallback(
    ({ data }: { data: Exercise[] }) => {
      setLocalExercises(data); // Immediate UI update
      if (!workout) return;

      // Sync to Zustand (which handles Supabase sync in the background)
      updateWorkout(workout.id, {
        ...workout,
        exercises: data,
      });
    },
    [workout, updateWorkout],
  );

  //Handle edit screen
  const handleEditPress = () => {
    if (!id) return;
    router.push({
      pathname: "/create-workout",
      params: { id: id },
    });
  };

  // RENDER ITEM COMPONENT
  const renderExerciseItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Exercise>) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            style={[
              styles.exerciseItem,
              {
                backgroundColor: isActive
                  ? Colors.cardSurface
                  : Colors.secondaryBackground,
                borderColor: isActive
                  ? Colors.primaryGreen
                  : Colors.cardSurface,
                transform: [{ scale: isActive ? 1.02 : 1 }],
              },
            ]}
          >
            <Ionicons
              name="reorder-two"
              size={24}
              color={isActive ? Colors.primaryGreen : Colors.textMuted}
            />

            <View style={styles.exerciseImagePlaceholder}>
              <FontAwesome5
                name="dumbbell"
                size={14}
                color={Colors.textSecondary}
              />
            </View>

            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseDetails}>
                {item.reps_mode ? `x${item.reps}` : `${item.time}s`} •{" "}
                {item.rest}s Rest
              </Text>
            </View>

            <View style={styles.setCount}>
              <Text style={styles.setText}>{item.sets}</Text>
              <Text style={styles.setLabel}>SETS</Text>
            </View>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    },
    [],
  );

  if (!workout) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* FIXED HEADER */}
        <View style={styles.fixedHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
              }}
              style={styles.headerImage}
            />
            <View style={[styles.navButtons, { top: insets.top + 10 }]}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerMeta}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View style={styles.statCardsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formattedDuration}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{localExercises.length}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
            </View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Exercises (Hold to Reorder)
              </Text>
              <TouchableOpacity
                style={styles.editButtonSmall}
                onPress={handleEditPress}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="pen" size={12} color={Colors.textMuted} />
                <Text style={styles.editButtonText}>EDIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* DRAGGABLE LIST */}
        <DraggableFlatList
          data={localExercises}
          onDragEnd={handleReorder}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          containerStyle={styles.listContainer}
          activationDistance={20} // Crucial for preventing scroll/drag glitch
          contentContainerStyle={{
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* FIXED FOOTER */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/workout-player/active",
                params: { id: id },
              })
            }
          >
            <Text style={styles.startButtonText}>START WORKOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  fixedHeader: { backgroundColor: Colors.background, zIndex: 10 },
  imageContainer: { width: SCREEN_WIDTH, height: 200 },
  headerImage: { width: "100%", height: "100%" },
  navButtons: { position: "absolute", left: 20, right: 20 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerMeta: { paddingHorizontal: 20, paddingTop: 20 },
  workoutName: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 20,
  },
  statCardsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cardSurface,
  },
  statValue: { color: Colors.textPrimary, fontSize: 18, fontWeight: "900" },
  statLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: "600" },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  listContainer: { flex: 1 },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  exerciseImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.cardSurface,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { color: Colors.textPrimary, fontSize: 15, fontWeight: "700" },
  exerciseDetails: { color: Colors.textSecondary, fontSize: 12 },
  setCount: { alignItems: "center", minWidth: 40 },
  setText: { color: Colors.primaryGreen, fontSize: 18, fontWeight: "900" },
  setLabel: { color: Colors.textSecondary, fontSize: 8, fontWeight: "700" },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    paddingTop: 10,
  },
  startButton: {
    backgroundColor: Colors.primaryGreen,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: { color: "#000", fontSize: 16, fontWeight: "900" },
  editButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editButtonText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
