import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { signIn, signOut, signUp } from "../lib/auth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state to track which field has an error for UI styling
  const [fieldErrors, setFieldErrors] = useState<{
    email?: boolean;
    pass?: boolean;
  }>({});

  const router = useRouter();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    confirmPass: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!name || !email || !pass || !confirmPass)
        throw new Error("All fields are required.");
      if (!validateEmail(email))
        throw new Error("Please enter a valid email address.");
      if (pass.length < 6)
        throw new Error("Password must be at least 6 characters.");
      if (pass !== confirmPass) throw new Error("Passwords do not match.");

      await signUp(name, email, pass);
      router.replace("/auth/confirm-email");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({}); // Clear previous field errors

    try {
      if (!email || !pass) {
        throw new Error("Please enter both email and password.");
      }

      await signIn(email, pass);
      // RootLayout handles redirect on success
    } catch (err: any) {
      const message = err.message.toLowerCase();
      Alert.alert("Debug Auth Error", err.message);

      // 1. Handle "Email not found" logic
      if (
        message.includes("user not found") ||
        message.includes("email not found")
      ) {
        setFieldErrors({ email: true });
        Alert.alert(
          "Account Not Found",
          "The email address you entered is not registered in our database.",
          [{ text: "OK" }],
        );
      }
      // 2. Handle "Invalid Password" logic
      else if (message.includes("invalid login credentials")) {
        setFieldErrors({ pass: true });
        setError("Incorrect password. Please try again.");
      }
      // 3. Generic error handling
      else {
        setError(err.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (err: any) {
      setError(err.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, login, logout, isLoading, error, fieldErrors };
};
