"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout";
import GameCard from "../../components/GameCard";

import { getGames } from "../../services/game.service";
import { Game } from "../../types/game";

const GENRES = [
  { label: "All Genres", value: "" },
  { label: "Action", value: "action" },
  { label: "Adventure", value: "adventure" },
  { label: "RPG", value: "rpg" },
  { label: "Strategy", value: "strategy" },
  { label: "Sports", value: "sports" },
  { label: "Indie", value: "indie" },
  { label: "Shooter", value: "shooter" },
  { label: "Racing", value: "racing" },
  { label: "Puzzle", value: "puzzle" },
  { label: "Simulation", value: "simulation" },
];

const PLATFORMS = [
  { label: "All Platforms", value: "" },
  { label: "PC", value: "4" },
  { label: "PlayStation", value: "187" },
  { label: "Xbox", value: "1" },
  { label: "Nintendo Switch", value: "7" },
];

export default function ExplorePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");

  useEffect(() => {
    fetchGames();
  }, [page, genre, platform]);

  const fetchGames = async () => {
    try {
      setLoading(true);

      const data = await getGames(
        page,
        genre,
        platform
      );

      const formatted: Game[] =
        data.map((game: any) => ({
          ...game,

          image:
            game.background_image,

          popularity:
            game.added ?? 0,

          price:
            Math.floor(
              Math.random() * 900000
            ) + 100000,
        }));

      setGames(formatted);
    } catch (error) {
      console.error(
        "Fetch games error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredGames =
    useMemo(() => {
      return games.filter(
        (game) =>
          game.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [games, search]);

  return (
    <DashboardLayout>
      <div className="p-8 text-white">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Explore Games
          </h1>

          <p className="text-slate-400 mt-2">
            Browse and discover games
            from RAWG API
          </p>
        </div>

        {/* FILTERS */}
        <div
          className="
            bg-[#111C33]
            rounded-2xl
            p-5
            mb-8
            grid
            md:grid-cols-3
            gap-4
          "
        >
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search game..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              bg-[#0B1020]
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
            "
          />

          {/* GENRE */}
          <select
            value={genre}
            onChange={(e) => {
              setGenre(
                e.target.value
              );
              setPage(1);
            }}
            className="
              bg-[#0B1020]
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          >
            {GENRES.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          {/* PLATFORM */}
          <select
            value={platform}
            onChange={(e) => {
              setPlatform(
                e.target.value
              );
              setPage(1);
            }}
            className="
              bg-[#0B1020]
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          >
            {PLATFORMS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-slate-400">
            Loading games...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          filteredGames.length ===
            0 && (
            <div className="text-center py-20 text-slate-400">
              No games found
            </div>
          )}

        {/* GRID */}
        {!loading &&
          filteredGames.length >
            0 && (
            <>
              <div
                className="
                  grid
                  md:grid-cols-2
                  lg:grid-cols-4
                  gap-6
                "
              >
                {filteredGames.map(
                  (game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                    />
                  )
                )}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-4 mt-10">
                <button
                  disabled={
                    page === 1
                  }
                  onClick={() =>
                    setPage(
                      page - 1
                    )
                  }
                  className="
                    px-5
                    py-2
                    bg-[#111C33]
                    rounded-xl
                    disabled:opacity-40
                  "
                >
                  Previous
                </button>

                <div className="flex items-center text-slate-300">
                  Page {page}
                </div>

                <button
                  onClick={() =>
                    setPage(
                      page + 1
                    )
                  }
                  className="
                    px-5
                    py-2
                    bg-cyan-400
                    text-black
                    rounded-xl
                    font-semibold
                  "
                >
                  Next
                </button>
              </div>
            </>
          )}
      </div>
    </DashboardLayout>
  );
}