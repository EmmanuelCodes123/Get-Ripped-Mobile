import { useAuth } from "@/src/hooks/useAuth";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import { supabase } from "../../lib/supabase"; //

export const Header = () => {
  const [firstName, setFirstName] = useState("Athlete");
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user-info")
        .select("name")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data?.name) {
        const nameParts: string = data.name.trim().split(" ");
        setFirstName(nameParts[0].toUpperCase());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        {/* Placeholder Avatar - You can use the first letter of firstName if no image exists */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{firstName[0]}</Text>
        </View>
        <View>
          <Text style={styles.greeting}>
            Hello {loading ? "..." : firstName} 👋
          </Text>
          <Text style={styles.subtitle}>Get ready 🔥</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Colors.textPrimary}
            onPress={() => router.push("/notifications")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={logout}>
          <MaterialCommunityIcons
            name="fire"
            size={24}
            color={Colors.accentOrange}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  profile: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.darkGreen,
  },
  avatarText: { color: Colors.primaryGreen, fontWeight: "800", fontSize: 18 },
  greeting: { color: Colors.textSecondary, fontSize: 14 },
  subtitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: "800" },
  actions: { flexDirection: "row", gap: 10 },
  btn: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: Colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
  },
});
