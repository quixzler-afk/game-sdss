import axios from "axios";

/**
 * Explore Games
 */
export async function getGames(
  page = 1,
  genre = "",
  platform = "",
  search = ""
) {
  const { data } = await axios.get("/api/games", {
    params: {
      page,
      genre,
      platform,
      search,
    },
  });

  return data.results ?? [];
}

/**
 * Detail Game
 */
export async function getGameById(
  id: string
) {
  const response = await fetch(
    `/api/games/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch game"
    );
  }

  return response.json();
}

/**
 * CheapShark Deals
 */
export async function getGameDeals(
  title: string
) {
  const { data } = await axios.get(
    `/api/games/deals`,
    {
      params: {
        title,
      },
    }
  );

  return data;
}