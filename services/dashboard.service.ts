import { supabase } from "../lib/supabase";

export async function getDashboardStats(
  userId: string
) {
  const [
    wishlistResult,
    historyResult,
  ] = await Promise.all([
    supabase
      .from("wishlist")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId),

    supabase
      .from(
        "recommendation_history"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId),
  ]);

  return {
    wishlistCount:
      wishlistResult.count ?? 0,

    historyCount:
      historyResult.count ?? 0,
  };
}