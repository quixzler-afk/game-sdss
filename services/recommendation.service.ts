import { supabase } from "../lib/supabase";

import {
  RecommendationHistoryPayload,
  AHPWeights,
} from "../types/recommendation";

import {
  GameAlternative,
} from "../types/game";

import { calculateTOPSIS } from "../lib/topsis";

import { TOPSIS_CRITERIA } from "../constants/topsis-criteria";

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

/**
 * =========================
 * SIMPLE CACHE (IN MEMORY)
 * =========================
 */
const cache = new Map<string, { data: GameAlternative[]; timestamp: number }>();

const CACHE_TTL = 1000 * 60 * 10; // 10 menit

function getCacheKey(genre?: string, platform?: string) {
  return `${genre ?? "all"}-${platform ?? "all"}`;
}

/**
 * =========================
 * FETCH GAMES (WITH CACHE)
 * =========================
 */
export async function getRecommendationGames(
  genre?: string,
  platform?: string,
): Promise<GameAlternative[]> {
  const cacheKey = getCacheKey(genre, platform);

  const cached = cache.get(cacheKey);

  // ✔ return cache jika masih valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  let url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=100`;

  if (genre) {
    url += `&genres=${genre}`;
  }

  if (platform) {
    url += `&platforms=${platform}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  const games: GameAlternative[] = (data.results ?? []).map((game: any) => ({
    id: game.id,

    name: game.name,

    image: game.background_image ?? "/placeholder-game.jpg",

    genre: game.genres?.map((g: any) => g.name).join(", ") ?? "Unknown",

    platform:
      game.parent_platforms?.map((p: any) => p.platform.name).join(", ") ??
      "Unknown",

    // sementara random price
    price: Math.floor(Math.random() * 900000) + 100000,

    metacritic: game.metacritic ?? 0,

    popularity: game.added ?? 0,

    rating: game.rating ?? 0,

    reviewCount: game.ratings_count ?? 0,

    releaseDate: game.released ? new Date(game.released).getTime() : 0,
  }));

  // ✔ simpan ke cache
  cache.set(cacheKey, {
    data: games,
    timestamp: Date.now(),
  });

  return games;
}

/**
 * =========================
 * TOPSIS GENERATOR
 * =========================
 */
export function generateRecommendation(
  games: GameAlternative[],
  weights: AHPWeights,
) {
  return calculateTOPSIS(games, TOPSIS_CRITERIA as any, weights);
}

/**
 * =========================
 * SUPABASE HISTORY
 * =========================
 */
export async function saveRecommendationHistory(
  payload: RecommendationHistoryPayload,
) {
  return supabase.from("recommendation_history").insert(payload);
}

export async function getRecommendationHistory(userId: string) {
  return supabase
    .from("recommendation_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function deleteRecommendationHistory(id: string) {
  return supabase.from("recommendation_history").delete().eq("id", id);
}
