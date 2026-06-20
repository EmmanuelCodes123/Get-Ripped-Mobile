import { useWorkoutStore } from "../store/useWorkoutStore";
import { supabase } from "./supabase";

export const signUp = async (name: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase.from("user-info").insert({
      id: data.user.id,
      email,
      name,
    });

    if (profileError) {
      console.error(
        "Failed to create user-info profile:",
        profileError.message,
      );
      throw profileError;
    }
  }

  return data;
};
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  useWorkoutStore.persist.clearStorage();

  if (error) throw error;
};

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
};

export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  return session;
};
