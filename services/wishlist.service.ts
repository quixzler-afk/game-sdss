import { supabase } from "../lib/supabase";

export interface Wishlist {
  id: string;

  user_id: string;

  game_id: number;

  game_name: string;

  image_url: string | null;

  created_at: string;
}

export interface AddWishlistPayload {
  user_id: string;

  game_id: number;

  game_name: string;

  image_url: string | null;
}

/**
 * =========================
 * GET ALL USER WISHLIST
 * =========================
 */
export async function getWishlist(
  userId: string
) {
  const { data, error } =
    await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  return {
    success: !error,
    data,
    error,
  };
}

/**
 * =========================
 * GET SINGLE GAME
 * =========================
 */
export async function getWishlistByGame(
  userId: string,
  gameId: number
) {
  const { data, error } =
    await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", userId)
      .eq("game_id", gameId)
      .maybeSingle();

  return {
    success: !error,
    data,
    error,
  };
}

/**
 * =========================
 * CHECK WISHLIST STATUS
 * =========================
 */
export async function isGameWishlisted(
  userId: string,
  gameId: number
) {
  const { data } =
    await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("game_id", gameId)
      .maybeSingle();

  return !!data;
}

/**
 * =========================
 * ADD WISHLIST
 * =========================
 */
export async function addWishlist(
  payload: AddWishlistPayload
) {
  const { data, error } =
    await supabase
      .from("wishlist")
      .insert(payload)
      .select()
      .single();

  return {
    success: !error,
    data,
    error,
  };
}

/**
 * =========================
 * REMOVE BY WISHLIST ID
 * =========================
 */
export async function removeWishlist(
  wishlistId: string
) {
  const { error } =
    await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishlistId);

  return {
    success: !error,
    error,
  };
}

/**
 * =========================
 * REMOVE BY GAME
 * =========================
 */
export async function removeWishlistByGame(
  userId: string,
  gameId: number
) {
  const { error } =
    await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("game_id", gameId);

  return {
    success: !error,
    error,
  };
}

/**
 * =========================
 * TOGGLE WISHLIST
 * =========================
 */
export async function toggleWishlist(
  payload: AddWishlistPayload
) {
  const existing =
    await getWishlistByGame(
      payload.user_id,
      payload.game_id
    );

  if (existing.data) {
    const removeResult =
      await removeWishlist(
        existing.data.id
      );

    return {
      action: "removed",
      ...removeResult,
    };
  }

  const addResult =
    await addWishlist(payload);

  return {
    action: "added",
    ...addResult,
  };
}