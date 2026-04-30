import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Colors from "../constants/Colors";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", pass: "" });
  const { login, isLoading, error, fieldErrors } = useAuth();

  const handleLogin = () => {
    login(formData.email, formData.pass);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(200).duration(800)}
        style={styles.header}
      >
        <Text style={styles.title}>WELCOME BACK</Text>
        <Text style={styles.subtitle}>Log in to continue your progress</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(800)}
        style={styles.form}
      >
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(txt) => setFormData({ ...formData, email: txt })}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[
            styles.input,
            fieldErrors.pass && { borderColor: "#FF0000", borderWidth: 1 }, // Only red if password is wrong
          ]}
          onChangeText={(txt) => setFormData({ ...formData, pass: txt })}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={[styles.primaryButton, { opacity: isLoading ? 0.7 : 1 }]}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text style={styles.linkText}>
            Don't have an account?{" "}
            <Text style={{ color: Colors.primaryGreen }}>Sign up</Text>
          </Text>
        </TouchableOpacity>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "center",
  },
  header: { marginBottom: 40 },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 8 },
  form: { width: "100%" },
  input: {
    backgroundColor: Colors.cardBackground,
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.softDarkSurface,
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
  linkText: { color: Colors.textSecondary, textAlign: "center", marginTop: 20 },
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

export default Login;
