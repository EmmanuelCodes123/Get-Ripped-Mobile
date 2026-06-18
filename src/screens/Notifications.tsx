import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="notifications-off-outline"
              size={40}
              color={Colors.textSecondary}
            />
          </View>
          <Text style={styles.emptyText}>No Notifications</Text>
          <Text style={styles.subText}>
            We'll let you know when something important happens.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  title: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardSurface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  subText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
