import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";

const categories = [
  "All",
  "Warm Up",
  "Cardio",
  "Strength",
  "Arms",
  "Legs",
  "Core",
];

export const CategoryList = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scroll}
  >
    {categories.map((cat, i) => (
      <TouchableOpacity
        key={cat}
        style={[styles.pill, i === 0 && styles.activePill]}
      >
        <Text style={[styles.text, i === 0 && styles.activeText]}>{cat}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: { paddingLeft: 24, marginBottom: 25 },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    marginRight: 10,
  },
  activePill: {
    borderWidth: 1,
    borderColor: Colors.primaryGreen,
    backgroundColor: "transparent",
  },
  text: { color: Colors.textSecondary, fontWeight: "600" },
  activeText: { color: Colors.primaryGreen },
});
