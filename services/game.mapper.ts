import { GameAlternative } from "../types/game";
import { usdToIdr } from "../lib/currency";

type CheapSharkDeal = {
  salePrice?: string;
};

type CheapSharkMap = Record<
  number,
  CheapSharkDeal | undefined
>;

export function mapRawgGames(
  games: any[],
  cheapSharkMap: CheapSharkMap = {}
): GameAlternative[] {
  return games.map((game) => {
    const cheapShark =
      cheapSharkMap[game.id];

    const genre =
      game.genres?.length > 0
        ? game.genres
            .map((g: any) => g.name)
            .join(", ")
        : "-";

    const platform =
      game.parent_platforms?.length > 0
        ? game.parent_platforms
            .map(
              (p: any) =>
                p.platform?.name
            )
            .filter(Boolean)
            .join(", ")
        : "-";

    return {
      id: Number(game.id),

      name: game.name ?? "Unknown Game",

      image:
        game.background_image ??
        "/placeholder-game.jpg",

      genre,

      platform,

      price: cheapShark?.salePrice
        ? usdToIdr(
            Number(
              cheapShark.salePrice
            )
          )
        : 0,

      metacritic:
        game.metacritic ?? 0,

      popularity:
        game.added ?? 0,

      rating:
        Number(game.rating) ?? 0,

      reviewCount:
        game.ratings_count ?? 0,

      releaseDate: game.released
        ? new Date(
            game.released
          ).getTime()
        : 0,
    };
  });
}