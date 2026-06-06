import { supabase } from "../lib/supabase";

/**
 * Add to wishlist
 */
export async function addWishlist(payload: {
  user_id: string;
  game_id: number;
  game_name: string;
  image_url?: string;
}) {
  const result = await supabase.from("wishlist").insert(payload);

  return {
    success: !result.error,
    data: result.data,
    error: result.error,
  };
}

/**
 * Get wishlist by user
 */
export async function getWishlist(userId: string) {
  const result = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return {
    success: !result.error,
    data: result.data ?? [],
    error: result.error,
  };
}

/**
 * Remove wishlist item
 */
export async function removeWishlist(id: string) {
  const result = await supabase
    .from("wishlist")
    .delete()
    .eq("id", id);

  return {
    success: !result.error,
    error: result.error,
  };
}