"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabase";

import {
  getRecommendationGames,
  generateRecommendation,
  saveRecommendationHistory,
} from "../../services/recommendation.service";

import { calculateAHPFromSliders } from "../../lib/ahp";

const CRITERIA = [
  {
    key: "price",
    label: "Affordable Price",
  },
  {
    key: "metacritic",
    label: "Metacritic Score",
  },
  {
    key: "popularity",
    label: "Popularity",
  },
  {
    key: "rating",
    label: "User Rating",
  },
  {
    key: "reviewCount",
    label: "Review Count",
  },
  {
    key: "releaseDate",
    label: "Release Date",
  },
];

function formatDate(timestamp: number) {
  if (!timestamp) return "-";

  return new Date(timestamp).toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(price);
}

function getRecommendationReason(game: any) {
  const reasons = [];

  if (game.metacritic >= 85)
    reasons.push("Metacritic sangat tinggi");

  if (game.rating >= 4.3)
    reasons.push("Rating pengguna sangat baik");

  if (game.popularity >= 5000)
    reasons.push("Populer di komunitas gamer");

  if (game.reviewCount >= 1000)
    reasons.push("Memiliki banyak ulasan");

  if (reasons.length === 0) {
    reasons.push(
      "Memiliki performa baik pada seluruh kriteria"
    );
  }

  return reasons.join(", ");
}

export default function RecommendationPage() {
  const [loading, setLoading] = useState(false);

  const [sliders, setSliders] =
    useState<Record<string, number>>({
      price: 75,
      metacritic: 95,
      popularity: 80,
      rating: 90,
      reviewCount: 70,
      releaseDate: 60,
    });

  const [result, setResult] =
    useState<any>(null);

  const weights = useMemo(() => {
    const total =
      Object.values(sliders).reduce(
        (a, b) => a + b,
        0
      ) || 1;

    const normalized: Record<
      string,
      number
    > = {};

    Object.keys(sliders).forEach((key) => {
      normalized[key] =
        sliders[key] / total;
    });

    return normalized;
  }, [sliders]);

  const handleCalculate =
    async () => {
      try {
        setLoading(true);

        const ahpResult =
          calculateAHPFromSliders(
            sliders
          );

        const games =
          await getRecommendationGames();

        const ranking =
          generateRecommendation(
            games,
            ahpResult.weights
          );

        setResult({
          ahp: ahpResult,
          ranking,
        });

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (
          user &&
          ranking?.length > 0
        ) {
          await saveRecommendationHistory(
            {
              user_id: user.id,
              genre: "All",
              platform: "All",
              ahp_weights:
                ahpResult.weights,
              recommendation_result:
                ranking.slice(0, 10),
              recommendation_name:
                ranking[0].name,
            }
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <DashboardLayout>
      <div className="p-8">

        <h1 className="text-3xl font-bold text-white">
          Game Recommendation
        </h1>

        <p className="text-slate-400 mt-2">
          AHP + TOPSIS Decision
          Support System
        </p>

        {/* AHP */}
        <div className="mt-6 bg-[#111C33] p-5 rounded-2xl border border-slate-800">

          <h2 className="text-white font-semibold mb-2">
            AHP Preference
          </h2>

          <p className="text-sm text-slate-400 mb-5">
            Geser slider sesuai
            tingkat kepentingan
            masing-masing
            kriteria.
          </p>

          {CRITERIA.map((c) => (
            <div
              key={c.key}
              className="mb-5"
            >
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>
                  {c.label}
                </span>

                <span>
                  {
                    sliders[
                      c.key
                    ]
                  }
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                value={
                  sliders[c.key]
                }
                onChange={(e) =>
                  setSliders({
                    ...sliders,
                    [c.key]:
                      Number(
                        e.target.value
                      ),
                  })
                }
                className="w-full"
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(
              weights
            ).map(([k, v]) => (
              <span
                key={k}
                className="
                  px-2 py-1
                  bg-slate-800
                  rounded-md
                  text-xs
                  text-slate-300
                "
              >
                {k}:{" "}
                {v.toFixed(3)}
              </span>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={
            handleCalculate
          }
          disabled={loading}
          className="
            w-full
            mt-6
            bg-cyan-400
            text-black
            py-3
            rounded-lg
            font-bold
          "
        >
          {loading
            ? "Calculating..."
            : "Generate Recommendation"}
        </button>

        {/* RESULT */}
        {result?.ranking?.length >
          0 && (
          <div className="mt-8 space-y-4">

            <h2 className="text-xl font-bold text-white">
              Recommendation Result
            </h2>

            {result.ranking
              .slice(0, 10)
              .map(
                (
                  g: any,
                  i: number
                ) => (
                  <Link
                    key={g.id}
                    href={`/game/${g.id}`}
                    className="block bg-[#111C33] p-4 rounded-xl border border-slate-800 hover:border-cyan-400 transition hover:shadow-[0_0_20px_rgba(77,238,234,0.15)]"
                  >
                    <div className="flex gap-4">

                      <img
                        src={
                          g.image ||
                          "/placeholder-game.jpg"
                        }
                        alt={
                          g.name
                        }
                        className="
                          w-20
                          h-24
                          object-cover
                          rounded-lg
                          flex-shrink-0
                        "
                      />

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-4">

                          <div>
                            <h3 className="text-white font-semibold">
                              #{i + 1}{" "}
                              {g.name}
                            </h3>

                            <p className="text-xs text-cyan-400 mt-1">
                              🎮{" "}
                              {g.genre}
                            </p>

                            <p className="text-xs text-slate-400">
                              🖥️{" "}
                              {g.platform}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-cyan-400 font-bold">
                              {g.topsisScore?.toFixed(
                                3
                              )}
                            </p>

                            <p className="text-[10px] text-slate-500">
                              TOPSIS
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-xs">

                          <span className="text-slate-300">
                            ⭐ Rating:{" "}
                            {g.rating}
                          </span>

                          <span className="text-slate-300">
                            🎯 Meta:{" "}
                            {
                              g.metacritic
                            }
                          </span>

                          <span className="text-slate-300">
                            🔥 Popularity:{" "}
                            {g.popularity?.toLocaleString()}
                          </span>

                          <span className="text-slate-300">
                            📝 Reviews:{" "}
                            {g.reviewCount?.toLocaleString()}
                          </span>

                          <span className="text-slate-300">
                            📅{" "}
                            {formatDate(
                              g.releaseDate
                            )}
                          </span>

                          <span className="text-green-400 font-semibold">
                            💰{" "}
                            {formatPrice(
                              g.price
                            )}
                          </span>

                        </div>

                        <div className="mt-3 bg-slate-900 rounded-lg p-2 text-xs text-cyan-300">
                          <strong>
                            Recommendation
                            Reason:
                          </strong>{" "}
                          {getRecommendationReason(
                            g
                          )}
                        </div>

                      </div>

                    </div>
                  </Link>
                )
              )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}