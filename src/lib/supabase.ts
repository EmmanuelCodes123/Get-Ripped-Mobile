import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://nehazxnrtxrshypveyuq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laGF6eG5ydHhyc2h5cHZleXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTgyNDksImV4cCI6MjA5MTczNDI0OX0.hgcGGUidLCeIGHslSi1Zv87e-UDbluV5n-8LYDNYjz4";

const storage =
  Platform.OS === "web"
    ? undefined // Web uses localStorage automatically
    : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This tells Supabase to use AsyncStorage on Mobile and standard storage on Web
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
