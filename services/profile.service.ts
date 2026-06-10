import { supabase } from "../lib/supabase";

export interface Profile {
  id: string;
  username: string;
  email?: string;
  created_at?: string;
}

export async function getProfile(
  userId: string
) {
  try {
    const { data, error } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    return {
      success: !error,
      data: data as Profile | null,
      error,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
}

/**
 * Update username
 */
export async function updateProfile(
  userId: string,
  username: string
) {
  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        username,
      })
      .eq("id", userId)
      .select()
      .single();

  return {
    success: !error,
    data,
    error,
  };
}

/**
 * Create profile
 */
export async function createProfile(
  userId: string,
  username: string,
  email?: string
) {
  const { data, error } =
    await supabase
      .from("profiles")
      .insert({
        id: userId,
        username,
        email,
      })
      .select()
      .single();

  return {
    success: !error,
    data,
    error,
  };
}