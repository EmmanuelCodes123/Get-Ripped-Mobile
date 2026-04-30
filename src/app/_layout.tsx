import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toast } from "../components/common/Toast";
import Colors from "../constants/Colors";
import { useSyncWorkouts } from "../hooks/useSyncWorkouts";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useSyncWorkouts(); // This starts the "listener" for internet and pending syncs

  // 1. Get initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. Handle routing logic
  useEffect(() => {
    if (loading) return;

    const inAuthGroup =
      segments[0] === "auth" || segments[0] === "getting-started";

    if (!session && !inAuthGroup) {
      router.replace("/getting-started");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, segments, loading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="getting-started" options={{ animation: "fade" }} />
        <Stack.Screen
          name="create-workout"
          options={{
            presentation: "modal", // Slides up from bottom
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="auth/confirm-email" />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
}
