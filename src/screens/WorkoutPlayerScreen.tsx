import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseTimer } from "../components/workout-player/ExerciseTimer";
import { PlayerHeader } from "../components/workout-player/PlayerHeader";
import Colors from "../constants/Colors";
import { Exercise, Workout } from "../types/workout";

interface Props {
  workout: Workout;
  currentExercise: Exercise;
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

  return (
    <View style={styles.screen}>
      <Animated.View style={{ flex: 1, opacity: uiOpacity }}>
        <View style={{ paddingTop: insets.top }}>
          <PlayerHeader
            routineName={props.workout.name}
            onBack={props.onBack}
          />
        </View>
        <ExerciseTimer {...props} />
      </Animated.View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
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
});
