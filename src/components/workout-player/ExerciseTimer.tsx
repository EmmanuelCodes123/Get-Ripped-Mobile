import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "../../constants/Colors";
import { Exercise } from "../../types/workout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = SCREEN_WIDTH * 0.82;
const RADIUS = (CIRCLE_SIZE - 20) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  currentExercise: Exercise;
  currentSet: number;
  status: "GET READY" | "GO" | "REST";
  displayValue: string;
  percentageLeft: number;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ExerciseTimer = ({
  currentExercise,
  currentSet,
  status,
  displayValue,
  percentageLeft,
  isActive,
  isMuted,
  onToggleMute,
  onPause,
  onNext,
  onPrev,
}: Props) => {
  if (!currentExercise) return null;

  const totalSetsNum = parseInt(currentExercise.sets || "1");

  // FIXED: If status is GO and we are in reps mode, circle stays full (offset 0)
  // Otherwise, it depletes based on percentageLeft
  const strokeDashoffset = useMemo(() => {
    const isRepsWorkPhase = status === "GO" && currentExercise.reps_mode;
    return isRepsWorkPhase ? 0 : CIRCUMFERENCE * (1 - (percentageLeft || 0));
  }, [percentageLeft, status, currentExercise.reps_mode]);

  const getStatusColor = () => {
    if (status === "GET READY") return "#FFD700";
    if (status === "REST") return "#FF4B4B";
    return Colors.primaryGreen;
  };

  return (
    <View style={styles.container}>
      <View style={styles.setsWrapper}>
        <Text style={styles.setsText}>{totalSetsNum} SETS</Text>
        <View style={styles.setsProgressRow}>
          {Array.from({ length: totalSetsNum }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.setSegment,
                {
                  backgroundColor:
                    i < currentSet ? Colors.primaryGreen : Colors.cardSurface,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.timerWrapper}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={Colors.secondaryBackground}
            strokeWidth={10}
            fill="none"
          />
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={getStatusColor()}
            strokeWidth={10}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.content}>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {status}
          </Text>
          <Text style={styles.value}>{displayValue}</Text>
          <TouchableOpacity onPress={onToggleMute} style={{ marginTop: 10 }}>
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-medium"}
              size={24}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {currentExercise.name}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={onPrev} style={styles.btnSmall}>
          <Ionicons name="play-skip-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPause} style={styles.btnLarge}>
          <Ionicons name={isActive ? "pause" : "play"} size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.btnSmall}>
          <Ionicons name="play-skip-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  setsWrapper: { width: "85%", alignSelf: "center", marginBottom: 20 },
  setsText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  setsProgressRow: { flexDirection: "row", width: "100%", height: 8, gap: 6 },
  setSegment: { flex: 1, borderRadius: 10 },
  timerWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: { position: "absolute" },
  content: { alignItems: "center" },
  status: { fontSize: 18, fontWeight: "900", letterSpacing: 3 },
  value: { color: "#FFF", fontSize: 80, fontWeight: "900" },
  nameContainer: {
    width: "100%",
    paddingHorizontal: 40,
    minHeight: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  controls: { flexDirection: "row", alignItems: "center", gap: 30 },
  btnSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondaryBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  btnLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryGreen,
    justifyContent: "center",
    alignItems: "center",
  },
});
