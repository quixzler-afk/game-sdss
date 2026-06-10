import { supabase } from "../lib/supabase";

export async function login(
  email: string,
  password: string
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function register(
  email: string,
  password: string,
  username?: string
) {
  const result =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

  return result;
}

export async function logout() {
  return supabase.auth.signOut();
}

export async function getUser() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Ambil username terbaik
 * Prioritas:
 * 1. profile.username
 * 2. auth metadata username
 * 3. email sebelum @
 */
export async function getDisplayName() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "Player";

  const metadataUsername =
    user.user_metadata?.username;

  if (metadataUsername) {
    return metadataUsername;
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Player";
}