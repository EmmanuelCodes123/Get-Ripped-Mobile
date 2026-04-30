import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

interface PlayerHeaderProps {
  routineName: string;
  onBack: () => void;
}

export const PlayerHeader = ({ routineName, onBack }: PlayerHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {routineName}
      </Text>

      <View style={{ width: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    justifyContent: "center",
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    flex: 1,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
