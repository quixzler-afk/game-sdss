import Link from "next/link";

import CurrencyText from "components/CurrencyText";
import { Game } from "../types/game";

interface Props {
  game: Game;
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

export default function GameCard({
  game,
}: Props) {
  const genres =
    game.genres
      ?.map((g) => g.name)
      .join(", ") ?? "Unknown";

  const platforms =
    game.parent_platforms
      ?.map(
        (p) => p.platform.name
      )
      .join(", ") ?? "Unknown";

  return (
    <Link
      href={`/game/${game.id}`}
      className="
        bg-[#111C33]
        border
        border-slate-800
        rounded-2xl
        overflow-hidden

        hover:scale-[1.02]
        hover:border-cyan-400
        transition
        group
        hover:shadow-[0_0_20px_rgba(77,238,234,0.15)]
      "
    >
      {/* IMAGE */}
      <img
        src={
          game.background_image ||
          game.image ||
          "/placeholder-game.jpg"
        }
        alt={game.name}
        className="
          w-full
          h-52
          object-cover
          group-hover:scale-105
          transition
        "
      />

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white line-clamp-1">
          {game.name}
        </h3>

        {/* GENRE */}
        <p className="text-cyan-400 text-xs mt-2 line-clamp-1">
          🎮 {genres}
        </p>

        {/* PLATFORM */}
        <p className="text-slate-400 text-xs mt-1 line-clamp-1">
          🖥️ {platforms}
        </p>

        {/* INFO */}
        <div className="mt-3 space-y-1 text-sm text-slate-300">
          <p>
            ⭐ Rating:{" "}
            {game.rating ?? 0}
          </p>

          <p>
            🏆 Metacritic:{" "}
            {game.metacritic ?? "N/A"}
          </p>

          <p>
            🔥 Popularity:{" "}
            {game.popularity ?? 0}
          </p>

          <p>
            📅 Released:{" "}
            {formatDate(
              game.released
            )}
          </p>

          {/* PRICE */}
          <div className="mt-2 text-green-400 font-semibold">
            💰{" "}
            <CurrencyText
              value={game.price}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}