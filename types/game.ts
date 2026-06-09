export interface Game {
  id: number;

  name: string;

  image: string;

  popularity?: number;

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

  popularity: number;

  rating: number;

  reviewCount: number;

  releaseDate: number;
}

export interface GameDetail {
  id: number;

  name: string;

  description: string;

  description_raw: string;

  background_image: string;

  background_image_additional?: string;

  website?: string;

  released: string;

  updated?: string;

  rating: number;

  ratings_count: number;

  reviews_count: number;

  metacritic: number;

  added: number;

  playtime: number;

  genres: any[];

  tags: any[];

  publishers: any[];

  developers: any[];

  stores: any[];

  parent_platforms: any[];

  esrb_rating?: {
    name: string;
  };

  clip?: {
    clip: string;
  };
}