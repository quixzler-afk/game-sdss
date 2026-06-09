"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import DashboardLayout from "../../components/DashboardLayout";

import { supabase } from "../../lib/supabase";

import {
  getRecommendationHistory,
  deleteRecommendationHistory,
} from "../../services/recommendation.service";

import { Trash2, History } from "lucide-react";

interface RankedGame {
  id: number;
  name: string;
  image?: string;

  genre?: string;
  platform?: string;

  rating?: number;
  metacritic?: number;

  topsisScore?: number;
  score?: number;
}

interface HistoryItem {
  id: string;

  user_id: string;

  platform: string;
  genre: string;

  recommendation_name: string;

  ahp_weights: any;

  recommendation_result: RankedGame[];

  created_at: string;
}

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setItems([]);
        return;
      }

      const { data, error } = await getRecommendationHistory(user.id);

      if (error) throw error;

      setItems((data as HistoryItem[]) ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Hapus history rekomendasi ini?");

    if (!confirmed) return;

    try {
      const { error } = await deleteRecommendationHistory(id);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8 text-white">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Recommendation History</h1>

          <p className="text-slate-400 mt-2">
            Riwayat rekomendasi game menggunakan AHP + TOPSIS
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-slate-400">
            Loading history...
          </div>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <div
            className="
              bg-[#111C33]
              border
              border-slate-800
              rounded-2xl
              p-10
              text-center
            "
          >
            <History
              size={48}
              className="
                mx-auto
                mb-4
                text-slate-500
              "
            />

            <h2 className="text-xl font-semibold">Belum Ada History</h2>

            <p className="text-slate-400 mt-2">
              Silakan generate rekomendasi terlebih dahulu
            </p>
          </div>
        )}

        {/* HISTORY LIST */}
        {!loading && items.length > 0 && (
          <div className="space-y-8">
            {items.map((item) => {
              const topGame = item.recommendation_result?.[0];

              return (
                <div
                  key={item.id}
                  className="
                    bg-[#111C33]
                    border
                    border-slate-800
                    rounded-2xl
                    overflow-hidden
                  "
                >
                  <div className="p-6">
                    <div
                      className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:justify-between
                        gap-6
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col
                          md:flex-row
                          gap-4
                        "
                      >
                        <div
                          className="
                            relative
                            w-full
                            md:w-52
                            h-32
                            rounded-xl
                            overflow-hidden
                            bg-slate-800
                          "
                        >
                          <Image
                            src={topGame?.image || "/placeholder-game.jpg"}
                            alt={topGame?.name || "Game Cover"}
                            fill
                            sizes="300px"
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <h2
                            className="
                              text-2xl
                              font-bold
                              text-white
                            "
                          >
                            {item.recommendation_name}
                          </h2>

                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              gap-2
                            "
                          >
                            <span
                              className="
                                px-3
                                py-1
                                rounded-lg
                                bg-slate-800
                                text-cyan-400
                                text-sm
                              "
                            >
                              🎮{" "}
                              {topGame?.genre || item.genre || "Unknown Genre"}
                            </span>

                            <span
                              className="
                                px-3
                                py-1
                                rounded-lg
                                bg-slate-800
                                text-slate-300
                                text-sm
                              "
                            >
                              🖥️{" "}
                              {topGame?.platform ||
                                item.platform ||
                                "Unknown Platform"}
                            </span>
                          </div>

                          <p
                            className="
                              text-slate-400
                              mt-3
                              text-sm
                            "
                          >
                            📅 Generated : {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="
                          self-start
                          p-3
                          rounded-xl
                          bg-red-500/10
                          text-red-400
                          hover:bg-red-500/20
                          transition
                        "
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-5">
                      <h3
                        className="
                          text-slate-300
                          mb-3
                        "
                      >
                        Top Recommendations
                      </h3>

                      <div
                        className="
                          grid
                          md:grid-cols-2
                          gap-2
                        "
                      >
                        {(item.recommendation_result || [])
                          .slice(0, 5)
                          .map((game: any, index) => (
                            <Link
                              key={game.id ?? `${item.id}-${index}`}
                              href={`/game/${game.id}`}
                              className="
                                block
                                bg-[#111C33]
                                p-4
                                rounded-xl
                                border
                                border-slate-800

                                hover:border-cyan-400
                                transition

                                hover:shadow-[0_0_20px_rgba(77,238,234,0.15)]
                              "
                            >
                              <div className="flex justify-between items-center">
                                <span
                                  className="
                                    text-white
                                    text-sm
                                    font-medium
                                  "
                                >
                                  {index + 1}. {game.name}
                                </span>

                                <span
                                  className="
                                      text-cyan-400
                                      text-sm
                                      font-semibold
                                    "
                                >
                                  {(
                                    game.score ??
                                    game.topsisScore ??
                                    0
                                  ).toFixed(4)}
                                </span>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </div>

                    {item.ahp_weights && (
                      <div
                        className="
                          mt-8
                          border-t
                          border-slate-800
                          pt-5
                        "
                      >
                        <h3 className="text-white font-semibold mb-3">
                          AHP Weights
                        </h3>

                        <div className="grid md:grid-cols-3 gap-3">
                          {Object.entries(item.ahp_weights).map(
                            ([key, value]) => (
                              <div
                                key={`${item.id}-${key}`}
                                className="
                                  bg-[#0B1020]
                                  rounded-xl
                                  p-3
                                "
                              >
                                <p className="text-slate-400 text-xs capitalize">
                                  {key}
                                </p>

                                <p className="text-cyan-400 font-semibold">
                                  {(Number(value) * 100).toFixed(2)}%
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
