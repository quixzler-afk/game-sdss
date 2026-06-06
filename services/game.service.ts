import axios from "axios";

/**
 * Get list games (Explore page)
 */
export async function getGames(
  page = 1,
  genre = "",
  platform = "",
  search = ""
) {
  const { data } = await axios.get(
    "/api/games",
    {
      params: {
        page,
        genre,
        platform,
        search,
      },
    }
  );

  return data.results ?? [];
}

/**
 * Get single game detail
 */
export async function getGameById(id: string) {
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );

  if (!res.ok) throw new Error("Game not found");

  return res.json();
}