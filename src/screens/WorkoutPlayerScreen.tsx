import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseTimer } from "../components/workout-player/ExerciseTimer";
import { PlayerHeader } from "../components/workout-player/PlayerHeader";
import Colors from "../constants/Colors";
import { Exercise, Workout } from "../types/workout";

interface Props {
  workout: Workout;
  currentExercise: Exercise;
  nextExercise?: Exercise;
  currentSet: number;
  currentRound: number;
  status: "GO" | "REST" | "GET READY";
  displayValue: string;
  percentageLeft: number;
  isActive: boolean;
  isMuted: boolean;
  showRoundBreak: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const WorkoutPlayerScreen = (props: Props) => {
  const insets = useSafeAreaInsets();
  const transitionAnim = useRef(new Animated.Value(0)).current;
  
  // State to control the Exercise List Modal
  const [isListVisible, setIsListVisible] = useState(false);

  useEffect(() => {
    Animated.timing(transitionAnim, {
      toValue: props.showRoundBreak ? 1 : 0,
      duration: 1000,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [props.showRoundBreak]);

  const uiOpacity = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const overlayScale = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  // Render function for the list items in the Modal
  const renderExerciseItem = ({ item, index }: { item: Exercise; index: number }) => {
    const isCurrent = item.id === props.currentExercise.id;

    return (
      <View style={[styles.exerciseItem, isCurrent && styles.currentExerciseItem]}>
        <View style={styles.exerciseIndexCircle}>
          <Text style={styles.exerciseIndexText}>{index + 1}</Text>
        </View>
        <View style={styles.exerciseDetails}>
          <Text style={[styles.exerciseItemName, isCurrent && styles.currentExerciseText]}>
            {item.name}
          </Text>
          <Text style={styles.exerciseItemStats}>
            {item.sets} Sets • {item.reps_mode ? `${item.reps} Reps` : `${item.time}s`}
          </Text>
        </View>
        {isCurrent && <Ionicons name="play" size={20} color={Colors.primaryGreen} />}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={{ flex: 1, opacity: uiOpacity }}>
        <View style={{ paddingTop: insets.top }}>
          <PlayerHeader
            routineName={props.workout.name}
            onBack={props.onBack}
          />
          {/* List Icon Button (Top Right) */}
          <TouchableOpacity
            style={[styles.listButton, { top: insets.top + 5 }]}
            onPress={() => setIsListVisible(true)}
          >
            <Ionicons name="list" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <ExerciseTimer {...props} />
      </Animated.View>

      {/* Round Break Overlay */}
      {props.showRoundBreak && (
        <Animated.View
          style={[
            styles.overlay,
            { opacity: transitionAnim, transform: [{ scale: overlayScale }] },
          ]}
        >
          <Text style={styles.roundLabel}>ROUND</Text>
          <Text style={styles.roundNumber}>{props.currentRound + 1}</Text>
        </Animated.View>
      )}

      {/* Exercises List Modal */}
      <Modal
        visible={isListVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsListVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Workout Plan</Text>
            <TouchableOpacity onPress={() => setIsListVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={props.workout.exercises}
            keyExtractor={(item) => item.id}
            renderItem={renderExerciseItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  listButton: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  roundLabel: {
    color: Colors.textSecondary,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 8,
  },
  roundNumber: { color: Colors.primaryGreen, fontSize: 140, fontWeight: "900" },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softSurface || "#333", // Fallback border color
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground || "#1E1E1E", // Fallback color
    padding: 16,
    borderRadius: 16,
    gap: 16,
    marginBottom: 16, // fallback for older react-native versions lacking gap
  },
  currentExerciseItem: {
    borderWidth: 2,
    borderColor: Colors.primaryGreen,
    backgroundColor: Colors.secondaryBackground || "#2A2A2A", 
  },
  exerciseIndexCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.softSurface || "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseIndexText: {
    color: Colors.textSecondary,
    fontWeight: "800",
    fontSize: 16,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseItemName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  currentExerciseText: {
    color: Colors.primaryGreen,
  },
  exerciseItemStats: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
});