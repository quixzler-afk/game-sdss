import { supabase } from "../lib/supabase";

export async function saveHistory(
  payload: {
    userId: string;

    platform: string;

    genre: string;

    recommendationName: string;

    ahpWeights: any;

    recommendationResult: any;
  }
) {
  return supabase
    .from(
      "recommendation_history"
    )
    .insert({
      user_id: payload.userId,

      platform:
        payload.platform,

      genre: payload.genre,

      recommendation_name:
        payload.recommendationName,

      ahp_weights:
        payload.ahpWeights,

      recommendation_result:
        payload.recommendationResult,
    });
}

export async function getHistory(
  userId: string
) {
  return supabase
    .from(
      "recommendation_history"
    )
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });
}