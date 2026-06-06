export interface Game {
  id: number;
  name: string;

  image: string;
  background_image: string;

  rating: number;
  metacritic: number;

  released: string;
  price: number;

  criticsScore: number;
  userScore: number;
  playtime: number;

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

export interface GameAlternative {
  id: number;

  name: string;

  image: string;

  genre: string;
  platform: string;

  price: number;

  metacritic: number;
  rating: number;

  popularity: number;
  reviewCount: number;

  releaseDate: number; // pakai timestamp / year number
}
