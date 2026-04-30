import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export const Footer = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color={Colors.primaryGreen} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="weight-lifter"
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Centered FAB */}
        <View style={styles.fabSpacer} />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/create-workout")}
        >
          <Ionicons name="add" size={32} color={Colors.background} />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="person-outline"
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  nav: {
    width: "100%",
    height: 80,
    backgroundColor: Colors.secondaryBackground,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
  },
  fabSpacer: { width: 50 },
  fab: {
    position: "absolute",
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primaryGreen,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: Colors.secondaryBackground,
  },
});
