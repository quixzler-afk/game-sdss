import Link from "next/link";

import CurrencyText from "components/CurrencyText";
import { Game } from "../types/game";

interface Props {
  game: Game;
}

export default function GameCard({ game }: Props) {
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
      "
    >
      {/* IMAGE */}
      <img
        src={game.background_image}
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

        {/* INFO */}
        <div className="mt-3 space-y-1 text-sm text-slate-300">
          <p>⭐ Rating: {game.rating}</p>

          <p>
            🏆 Metacritic:{" "}
            {game.metacritic ?? "N/A"}
          </p>

          <p>📅 Released: {game.released}</p>

          {/* PRICE */}
          <div className="mt-2">
            <CurrencyText value={game.price} />
          </div>
        </div>
      </div>
    </Link>
  );
}