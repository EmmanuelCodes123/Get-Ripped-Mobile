import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

interface Props {
  onSave: () => void;
  onClose: () => void;
  isEditMode?: boolean;
}

export const WorkoutHeader = ({ onSave, onClose, isEditMode }: Props) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
      <Ionicons name="close" size={28} color={Colors.textPrimary} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>
      {isEditMode ? "Edit Routine" : "New Routine"}
    </Text>
    <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
      <Text style={styles.saveBtnText}>SAVE</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softSurface,
  },
  iconBtn: { padding: 4 },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  saveBtn: {
    backgroundColor: Colors.primaryGreen,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: { color: Colors.background, fontWeight: "900", fontSize: 14 },
});
