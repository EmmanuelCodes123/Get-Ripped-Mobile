import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Colors from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";

const Signup = () => {
  const router = useRouter();
  // State to handle user input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
  });
  const { signup, isLoading, error } = useAuth();

  const handleSignup = () => {
    signup(formData.name, formData.email, formData.pass, formData.confirmPass);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(200).duration(800)}
        style={styles.header}
      >
        <Text style={styles.title}>CREATE ACCOUNT</Text>
        <Text style={styles.subtitle}>
          Start your journey to getting ripped
        </Text>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.linkText}>
            Already have an account?{" "}
            <Text style={{ color: Colors.primaryGreen }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(800)}
        style={styles.form}
      >
        {/* Error Feedback Display using Aggressive Red [cite: 9] */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            onChangeText={(txt) => setFormData({ ...formData, name: txt })}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(txt) => setFormData({ ...formData, email: txt })}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            style={styles.input}
            onChangeText={(txt) => setFormData({ ...formData, pass: txt })}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            style={styles.input}
            onChangeText={(txt) =>
              setFormData({ ...formData, confirmPass: txt })
            }
          />

          <TouchableOpacity
            onPress={handleSignup}
            disabled={isLoading}
            style={[styles.primaryButton, { opacity: isLoading ? 0.7 : 1 }]}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.buttonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <FontAwesome name="google" size={18} color="#DB4437" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "center",
  },
  header: { marginBottom: 10 },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBlock: 12 },
  form: { width: "100%" },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF0000", // Aggressive Red [cite: 9]
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.cardBackground,
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primaryGreen,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: Colors.background, fontWeight: "800", fontSize: 16 },
  linkText: { color: Colors.textSecondary, marginBottom: 20 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  line: { flex: 1, height: 1, backgroundColor: Colors.softSurface },
  dividerText: { color: Colors.textMuted, paddingHorizontal: 10, fontSize: 12 },
  googleButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.softSurface,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
  },
  googleButtonText: { color: Colors.textPrimary, fontWeight: "600" },
});

export default Signup;
