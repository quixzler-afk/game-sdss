"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Calendar,
  Heart,
  Monitor,
  Star,
  Trophy,
} from "lucide-react";

import DashboardLayout from "components/DashboardLayout";
import { supabase } from "lib/supabase";

interface GameDetail {
  id: number;
  name: string;
  description_raw: string;
  background_image: string;
  rating: number;
  metacritic: number;
  released: string;

  genres: {
    id: number;
    name: string;
  }[];

  parent_platforms: {
    platform: {
      id: number;
      name: string;
    };
  }[];
}

export default function GameDetailPage() {
  const params = useParams();

  const [game, setGame] =
    useState<GameDetail | null>(null);

  const [screenshots, setScreenshots] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchGame();
      fetchScreenshots();
    }
  }, [params?.id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(
        `/api/games/${params.id}`
      );

      const data =
        await response.json();

      setGame(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScreenshots =
    async () => {
      try {
        const response = await fetch(
          `/api/games/${params.id}/screenshots`
        );

        const data =
          await response.json();

        setScreenshots(
          data.results || []
        );
      } catch (error) {
        console.error(error);
      }
    };

  const addToWishlist =
    async () => {
      if (!game) return;

      try {
        setSaving(true);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          alert(
            "Silakan login terlebih dahulu"
          );
          return;
        }

        const { error } =
          await supabase
            .from("wishlist")
            .insert({
              user_id: user.id,
              game_id: game.id,
              game_name: game.name,
              image_url:
                game.background_image,
            });

        if (error) {
          if (
            error.message.includes(
              "wishlist_user_game_unique"
            )
          ) {
            alert(
              "Game sudah ada di wishlist"
            );
            return;
          }

          throw error;
        }

        alert(
          "Game berhasil ditambahkan ke wishlist"
        );
      } catch (error: any) {
        alert(error.message);
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  if (!game) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white">
          Game tidak ditemukan.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="text-white">

        {/* HERO */}
        <div className="relative h-[450px]">
          <img
            src={game.background_image}
            alt={game.name}
            className="
              w-full
              h-full
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#0B1020]
              via-black/60
              to-transparent
            "
          />

          <div
            className="
              absolute
              bottom-10
              left-10
            "
          >
            <h1
              className="
                text-5xl
                font-bold
                mb-4
              "
            >
              {game.name}
            </h1>

            <div className="flex flex-wrap gap-2">
              {game.genres.map(
                (genre) => (
                  <span
                    key={genre.id}
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-cyan-500/20
                      text-cyan-400
                      text-sm
                    "
                  >
                    {genre.name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">

          {/* STATS */}
          <div
            className="
              grid
              md:grid-cols-4
              gap-5
              mb-8
            "
          >
            <div
              className="
                bg-[#111C33]
                rounded-xl
                p-5
              "
            >
              <Star
                className="mb-2"
                size={22}
              />

              <p className="text-slate-400">
                Rating
              </p>

              <h2 className="text-2xl font-bold">
                {game.rating}
              </h2>
            </div>

            <div
              className="
                bg-[#111C33]
                rounded-xl
                p-5
              "
            >
              <Trophy
                className="mb-2"
                size={22}
              />

              <p className="text-slate-400">
                Metacritic
              </p>

              <h2 className="text-2xl font-bold">
                {game.metacritic ??
                  "N/A"}
              </h2>
            </div>

            <div
              className="
                bg-[#111C33]
                rounded-xl
                p-5
              "
            >
              <Calendar
                className="mb-2"
                size={22}
              />

              <p className="text-slate-400">
                Release Date
              </p>

              <h2 className="font-semibold">
                {game.released}
              </h2>
            </div>

            <div
              className="
                bg-[#111C33]
                rounded-xl
                p-5
              "
            >
              <Monitor
                className="mb-2"
                size={22}
              />

              <p className="text-slate-400">
                Platforms
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {game.parent_platforms?.map(
                  (item) => (
                    <span
                      key={
                        item.platform.id
                      }
                      className="
                        bg-slate-700
                        px-2
                        py-1
                        rounded
                        text-xs
                      "
                    >
                      {
                        item.platform
                          .name
                      }
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* WISHLIST BUTTON */}
          <div className="mb-8">
            <button
              onClick={addToWishlist}
              disabled={saving}
              className="
                flex
                items-center
                gap-2
                bg-cyan-400
                text-black
                px-5
                py-3
                rounded-xl
                font-semibold
                hover:opacity-90
              "
            >
              <Heart size={18} />

              {saving
                ? "Saving..."
                : "Add to Wishlist"}
            </button>
          </div>

          {/* DESCRIPTION */}
          <div
            className="
              bg-[#111C33]
              rounded-xl
              p-6
              mb-8
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                mb-4
              "
            >
              Description
            </h2>

            <p
              className="
                text-slate-300
                leading-8
              "
            >
              {game.description_raw}
            </p>
          </div>

          {/* SCREENSHOTS */}
          <div>
            <h2
              className="
                text-2xl
                font-bold
                mb-5
              "
            >
              Screenshots
            </h2>

            <div
              className="
                grid
                md:grid-cols-2
                gap-5
              "
            >
              {screenshots.map(
                (shot) => (
                  <img
                    key={shot.id}
                    src={shot.image}
                    alt="screenshot"
                    className="
                      rounded-xl
                      w-full
                    "
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}