"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout";

import { supabase } from "../../lib/supabase";

import {
  getRecommendationHistory,
  deleteRecommendationHistory,
} from "../../services/recommendation.service";

import { Trash2 } from "lucide-react";

interface HistoryItem {
  id: string;
  user_id: string;
  platform: string;
  genre: string;
  recommendation_name: string;
  ahp_weights: any;
  recommendation_result: any[];
  created_at: string;
}

export default function HistoryPage() {
  const [loading, setLoading] =
    useState(true);

  const [items, setItems] =
    useState<HistoryItem[]>([]);

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

      const { data, error } =
        await getRecommendationHistory(
          user.id
        );

      if (error) throw error;

      setItems(
        (data as HistoryItem[]) ?? []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = confirm(
      "Hapus history ini?"
    );

    if (!confirmed) return;

    try {
      const { error } =
        await deleteRecommendationHistory(
          id
        );

      if (error) throw error;

      setItems((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 text-white">

        {/* HEADER */}
        <div className="mb-8">
          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Recommendation History
          </h1>

          <p
            className="
              text-slate-400
              mt-2
            "
          >
            Riwayat hasil AHP + TOPSIS
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div
            className="
              py-10
              text-slate-400
            "
          >
            Loading history...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          items.length === 0 && (
            <div
              className="
                bg-[#111C33]
                border
                border-slate-800
                rounded-2xl
                p-10
                text-center
                text-slate-400
              "
            >
              Belum ada history rekomendasi
            </div>
          )}

        {/* LIST */}
        {!loading &&
          items.length > 0 && (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-[#111C33]
                    border
                    border-slate-800
                    rounded-2xl
                    p-6
                  "
                >
                  {/* HEADER */}
                  <div
                    className="
                      flex
                      justify-between
                      items-start
                    "
                  >
                    <div>
                      <h2
                        className="
                          text-xl
                          font-bold
                          text-white
                        "
                      >
                        {
                          item.recommendation_name
                        }
                      </h2>

                      <p
                        className="
                          text-sm
                          text-slate-400
                          mt-1
                        "
                      >
                        {item.genre || "All Genre"}
                        {" • "}
                        {item.platform ||
                          "All Platform"}
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-1
                        "
                      >
                        {new Date(
                          item.created_at
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="
                        text-red-400
                        hover:text-red-500
                        transition
                      "
                    >
                      <Trash2
                        size={18}
                      />
                    </button>
                  </div>

                  {/* TOP RESULT */}
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
                      {(
                        item.recommendation_result ||
                        []
                      )
                        .slice(0, 5)
                        .map(
                          (
                            game: any,
                            index
                          ) => (
                            <div
                              key={
                                game.id
                              }
                              className="
                                flex
                                justify-between
                                bg-[#0B1020]
                                p-3
                                rounded-lg
                              "
                            >
                              <span
                                className="
                                  text-white
                                  text-sm
                                "
                              >
                                {index + 1}.{" "}
                                {
                                  game.name
                                }
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
                                ).toFixed(
                                  4
                                )}
                              </span>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  {/* AHP WEIGHT */}
                  {item.ahp_weights && (
                    <div
                      className="
                        mt-5
                        text-xs
                        text-slate-400
                        border-t
                        border-slate-800
                        pt-4
                      "
                    >
                      <p>
                        Weights :
                        {" "}
                        {Array.isArray(
                          item.ahp_weights
                        )
                          ? item.ahp_weights
                              .map(
                                (
                                  weight
                                ) =>
                                  Number(
                                    weight
                                  ).toFixed(
                                    2
                                  )
                              )
                              .join(
                                " | "
                              )
                          : JSON.stringify(
                              item.ahp_weights
                            )}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

      </div>
    </DashboardLayout>
  );
}