import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import Colors from "../constants/Colors";

const EmailConfirmation = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Check Symbol */}
        <Animated.View
          entering={ZoomIn.duration(800)}
          style={styles.iconContainer}
        >
          <Ionicons
            name="checkmark-circle"
            size={100}
            color={Colors.primaryGreen}
          />
        </Animated.View>

        {/* Text Content */}
        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <Text style={styles.title}>VERIFY YOUR EMAIL</Text>
          <Text style={styles.subtitle}>
            We've sent a magic link to your inbox. Please confirm your account
            to start your training.
          </Text>
        </Animated.View>
      </View>

      {/* Action Button to return to Login */}
      <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={styles.buttonText}>BACK TO LOGIN</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 40,
    shadowColor: Colors.primaryGreen,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingBottom: 40,
  },
  button: {
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.softSurface,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.textPrimary,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default EmailConfirmation;
