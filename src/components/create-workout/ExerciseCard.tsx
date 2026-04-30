import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";

export const ExerciseCard = ({
  index,
  exercise,
  updateExercise,
  removeExercise,
}: any) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.card}>
      {/* HEADER: Toggle & Delete integrated here */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.headerMain}
          onPress={toggleCollapse}
          activeOpacity={0.8}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{index + 1}</Text>
          </View>
          <Text style={styles.exerciseTitle} numberOfLines={1}>
            {exercise.name || "EXERCISE NAME"}
          </Text>
          <Ionicons
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={18}
            color={Colors.textMuted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => removeExercise(exercise.id)}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={Colors.aggressiveRed}
          />
        </TouchableOpacity>
      </View>

      {!isCollapsed && (
        <View style={styles.cardBody}>
          <Text style={styles.fieldLabel}>EXERCISE NAME</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Pushups, Pullups, etc."
            placeholderTextColor={Colors.textMuted}
            value={exercise.name}
            onChangeText={(v) => updateExercise(exercise.id, "name", v)}
          />

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>
                {exercise.repsMode ? "Reps Mode" : "Time Mode"}
              </Text>
              <Text style={styles.toggleSub}>
                {exercise.repsMode ? "Target: Repetitions" : "Target: Seconds"}
              </Text>
            </View>
            <Switch
              value={exercise.repsMode}
              onValueChange={(v) => updateExercise(exercise.id, "repsMode", v)}
              trackColor={{ false: Colors.softSurface, true: Colors.darkGreen }}
              thumbColor={
                exercise.repsMode ? Colors.primaryGreen : Colors.neutralSurface
              }
            />
          </View>

          {/* Cleaned Stat Row */}
          <View style={styles.statsRow}>
            <StatBox
              label={exercise.repsMode ? "REPS" : "TIME"}
              value={exercise.repsMode ? exercise.reps : exercise.time}
              onChange={(v: string) =>
                updateExercise(
                  exercise.id,
                  exercise.repsMode ? "reps" : "time",
                  v,
                )
              }
            />
            <StatBox
              label="SETS"
              value={exercise.sets}
              onChange={(v: string) => updateExercise(exercise.id, "sets", v)}
            />
            <StatBox
              label="REST(s)"
              value={exercise.rest}
              onChange={(v: string) => updateExercise(exercise.id, "rest", v)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const StatBox = ({ label, value, onChange }: any) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <TextInput
      style={styles.statInput}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      placeholder="0"
      placeholderTextColor={Colors.textMuted}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 20,
    marginTop: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.subtleGreen,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    paddingRight: 8,
  },
  headerMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  badgeText: { color: Colors.background, fontSize: 11, fontWeight: "900" },
  exerciseTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontWeight: "800",
    fontSize: 14,
    textTransform: "uppercase",
  },
  deleteBtn: { padding: 12 },
  cardBody: { padding: 16 },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: "900",
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: Colors.cardBackground,
    height: 50,
    borderRadius: 12,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.cardSurface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleTitle: { color: Colors.textPrimary, fontWeight: "700", fontSize: 13 },
  toggleSub: { color: Colors.textMuted, fontSize: 10 },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: { flex: 1 },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },
  statInput: {
    backgroundColor: Colors.cardBackground,
    height: 48,
    borderRadius: 10,
    color: Colors.primaryGreen,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
});
