import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import Animated, { FadeInRight, FadeOutRight } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import { useToastStore } from "../../store/useToastStore";

export const Toast = () => {
  const { visible, message, type, hideToast } = useToastStore();

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return Colors.darkGreen;
      case "error":
        return Colors.aggressiveRed;
      case "info":
        return Colors.cardSurface; // Use your card color for a neutral look
      default:
        return Colors.cardSurface;
    }
  };

  const getIcon = () => {
    // Check message content first for specific actions
    const isDeleteAction =
      message.toLowerCase().includes("delete") ||
      message.toLowerCase().includes("remove");

    if (isDeleteAction) {
      return "trash-outline"; // Returns the trash bin icon name
    }

    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "info":
        return "information-circle"; // Professional info icon
      default:
        return "notifications";
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400)}
      exiting={FadeOutRight.duration(400)}
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
    >
      <Ionicons
        name={getIcon()}
        size={20}
        color={type === "success" ? Colors.primaryGreen : "#FFF"}
      />
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={hideToast}>
        <Ionicons name="close" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60, // Sits below the notch
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 9999,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    maxWidth: Dimensions.get("window").width - 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  text: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    marginHorizontal: 10,
  },
});

import { TouchableOpacity } from "react-native-gesture-handler";

