import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    BackHandler,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  // Optional: Pass the workout name or total time via params to display here
  const { workoutName = "Workout" } = useLocalSearchParams<{
    workoutName: string;
  }>();

  // Prevent Android hardware back button from going back to the timer
  useEffect(() => {
    const onBackPress = () => {
      router.replace("/");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => backHandler.remove();
  }, []);

  const handleFinish = () => {
    // Replace clears the stack so they don't go back to the active timer
    router.replace("/");
  };

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen
        options={{
          headerShown: false,
          // A modal slide-up feels like a "Completion Certificate" popping up
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: false, // Force them to use the "Done" button
          contentStyle: { backgroundColor: Colors.background },
        }}
      />

      <SafeAreaView style={styles.container}>
        {/* Main Content Area - Centered */}
        <View style={styles.content}>
          <View style={styles.iconRing}>
            <View style={styles.iconCircle}>
              <Ionicons name="trophy" size={60} color={Colors.background} />
            </View>
          </View>

          <Text style={styles.title}>ROUTINE COMPLETE</Text>
          <Text style={styles.subtitle}>
            Great job crushing your{" "}
            <Text style={{ color: "#FFF" }}>{workoutName}</Text> session today.
          </Text>

          {/* You can easily drop in stats here later like: */}
          {/* <View style={styles.statsRow}> ... </View> */}
        </View>

        {/* Bottom Action */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.8}
            onPress={handleFinish}
          >
            <Text style={styles.doneBtnText}>FINISH</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, justifyContent: "space-between" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(189, 255, 0, 0.1)", // Faint green halo
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryGreen, // Your app's highlight color
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: Colors.primaryGreen,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  doneBtn: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  doneBtnText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
