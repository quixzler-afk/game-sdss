import { GameAlternative } from "../types/game";
import { usdToIdr } from "../lib/currency";

export function mapRawgGames(
  games: any[],
  cheapSharkMap: Record<number, any> = {}
): GameAlternative[] {
  return games.map((game) => {
    const cheapShark = cheapSharkMap[game.id];

    return {
      id: game.id,
      name: game.name,
      image: game.background_image,

      genre: game.genres?.[0]?.name ?? "-",
      platform:
        game.parent_platforms?.[0]?.platform?.name ?? "-",

      price: cheapShark
        ? usdToIdr(Number(cheapShark.salePrice))
        : 0,

      metacritic: game.metacritic ?? 0,
      popularity: game.added ?? 0,
      rating: game.rating ?? 0,
      reviewCount: game.ratings_count ?? 0,

      releaseDate: new Date(
        game.released ?? "2000-01-01"
      ).getTime(),
    };
  });
}