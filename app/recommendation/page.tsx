"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabase";

import {
  getRecommendationGames,
  generateRecommendation,
  saveRecommendationHistory,
} from "../../services/recommendation.service";

import { calculateAHPFromSliders } from "../../lib/ahp";

// =========================
// DATA
// =========================
const CRITERIA = [
  { key: "price", label: "Price (Rp)" },
  { key: "metacritic", label: "Metacritic Score" },
  { key: "popularity", label: "Popularity" },
  { key: "rating", label: "User Rating" },
  { key: "reviewCount", label: "Review Count" },
  { key: "releaseDate", label: "Release Date" },
];

const GENRES = [
  "action",
  "adventure",
  "rpg",
  "shooter",
  "strategy",
  "racing",
  "sports",
  "simulation",
  "puzzle",
  "indie",
];

const PLATFORM_MAP: Record<string, number> = {
  pc: 4,
  playstation: 18,
  xbox: 1,
  "nintendo-switch": 7,
};

export default function RecommendationPage() {
  const [loading, setLoading] = useState(false);

  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");

  const [sliders, setSliders] = useState<Record<string, number>>({
    price: 50,
    metacritic: 50,
    popularity: 50,
    rating: 50,
    reviewCount: 50,
    releaseDate: 50,
  });

  const [result, setResult] = useState<any>(null);

  // =========================
  // NORMALIZED WEIGHTS
  // =========================
  const weights = useMemo(() => {
    const total = Object.values(sliders).reduce((a, b) => a + b, 0) || 1;

    const normalized: Record<string, number> = {};
    Object.keys(sliders).forEach((k) => {
      normalized[k] = sliders[k] / total;
    });

    return normalized;
  }, [sliders]);

  // =========================
  // CALCULATE
  // =========================
  const handleCalculate = async () => {
    try {
      setLoading(true);

      // AHP
      const ahpResult = calculateAHPFromSliders(sliders);

      // FIX PLATFORM RAWG
      const platformId = platform ? PLATFORM_MAP[platform] : undefined;

      // FETCH GAMES
      const games = await getRecommendationGames(genre, platform);

      if (!games || games.length === 0) {
        setResult({ ahp: ahpResult, ranking: [] });
        return;
      }

      // TOPSIS
      const ranking = generateRecommendation(games, ahpResult.weights);
      const safeRanking = ranking || [];

      setResult({
        ahp: ahpResult,
        ranking: safeRanking,
      });

      // SAVE HISTORY
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && safeRanking.length > 0) {
        await saveRecommendationHistory({
          user_id: user.id,
          genre,
          platform,
          ahp_weights: ahpResult.weights,
          recommendation_result: safeRanking.slice(0, 10),
          recommendation_name: safeRanking[0]?.name ?? "Recommendation",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-white">
          Game Recommendation System
        </h1>

        <p className="text-slate-400 mt-2 mb-6">
          AHP + TOPSIS Decision Support System
        </p>

        {/* FILTER */}
        <div className="bg-[#111C33] p-4 rounded-xl border border-slate-800 space-y-4">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-3 bg-[#0B1020] border border-slate-700 rounded-lg text-white"
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-3 bg-[#0B1020] border border-slate-700 rounded-lg text-white"
          >
            <option value="">All Platforms</option>
            <option value="pc">PC</option>
            <option value="playstation">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="nintendo-switch">Nintendo Switch</option>
          </select>
        </div>

        {/* SLIDER */}
        <div className="mt-6 bg-[#111C33] p-5 rounded-2xl border border-slate-800">
          <h2 className="text-white font-semibold mb-4">
            AHP Preference (Slider)
          </h2>

          {CRITERIA.map((c) => (
            <div key={c.key} className="mb-4">
              <div className="flex justify-between text-slate-300 text-sm">
                <span>{c.label}</span>
                <span>{sliders[c.key]}</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliders[c.key]}
                onChange={(e) =>
                  setSliders({
                    ...sliders,
                    [c.key]: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          ))}

          <div className="text-xs text-slate-400 mt-3">
            {Object.entries(weights).map(([k, v]) => (
              <p key={k}>
                {k}: {Number(v).toFixed(3)}
              </p>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full mt-6 bg-cyan-400 text-black py-3 rounded-lg font-bold"
        >
          {loading ? "Calculating..." : "Generate Recommendation"}
        </button>

        {/* RESULT (STYLE LAMA) */}
        {result?.ranking?.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-white text-xl font-bold">
              Recommendation Result
            </h2>

            {result.ranking.slice(0, 10).map((g: any, i: number) => (
              <Link
                key={g.id}
                href={`/game/${g.id}`}
                className="block bg-[#111C33] p-4 rounded-xl border border-slate-800 hover:border-cyan-400 transition hover:shadow-[0_0_20px_rgba(77,238,234,0.15)]"
              >
                <div className="flex justify-between">
                  <div className="text-white font-semibold">
                    #{i + 1} {g.name}
                  </div>

                  <div className="text-cyan-400 font-bold">
                    {g.topsisScore?.toFixed(3)}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  AHP + TOPSIS Ranking Score
                </p>
              </Link>
            ))}
          </div>
        )}

        {!loading && result && result.ranking?.length === 0 && (
          <div className="mt-6 text-slate-400">
            No games found for selected filter
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}