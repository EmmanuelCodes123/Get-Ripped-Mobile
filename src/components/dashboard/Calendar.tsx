import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();

  return (
    <View style={styles.container}>
      {days.map((day, i) => (
        <View key={day} style={styles.dayCol}>
          <Text style={styles.label}>{day}</Text>
          <View style={[styles.ring, i === today && styles.activeRing]}>
            <Text style={[styles.num, i === today && styles.activeText]}>
              {13 + i}
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
