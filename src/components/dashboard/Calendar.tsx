import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const currentDate = new Date();
  const todayIndex = currentDate.getDay(); // 0 for Sun, 1 for Mon, etc.

  // Generate the actual numeric dates for the current week
  const weekDates = days.map((_, i) => {
    const date = new Date();
    // Shift the date back to Sunday, then add the current loop index (i)
    date.setDate(currentDate.getDate() - todayIndex + i);
    return date.getDate();
  });

  return (
    <View style={styles.container}>
      {days.map((day, i) => (
        <View key={day} style={styles.dayCol}>
          <Text style={styles.label}>{day}</Text>
          <View style={[styles.ring, i === todayIndex && styles.activeRing]}>
            <Text style={[styles.num, i === todayIndex && styles.activeText]}>
              {weekDates[i]}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  dayCol: { alignItems: "center", gap: 8 },
  label: { color: Colors.textSecondary, fontSize: 12 },
  ring: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.softSurface,
    justifyContent: "center",
    alignItems: "center",
  },
  activeRing: { borderColor: Colors.primaryGreen, borderWidth: 2 },
  num: { color: Colors.textSecondary, fontWeight: "600" },
  activeText: { color: Colors.primaryGreen },
});