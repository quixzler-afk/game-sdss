export interface AHPWeights {
  price: number;
  metacritic: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  releaseDate: number;
}

export interface GameAlternative {
  id: number;

  name: string;

  image: string;

  genre?: string;

  platform?: string;

  price: number;

  metacritic: number;

  popularity: number;

  rating: number;

  reviewCount: number;

  releaseDate: number;
}

export interface RankedGame
  extends GameAlternative {
  topsisScore: number;

  rank: number;
}

export interface RecommendationHistoryPayload {
  user_id: string;

  platform: string;

  genre: string;

  recommendation_name: string;

  ahp_weights: AHPWeights;

  recommendation_result: RankedGame[];
}

export interface CriterionBreakdown {
  price: number;
  metacritic: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  releaseDate: number;
}

export interface RankedGame extends GameAlternative {
  topsisScore: number;
  rank: number;

  breakdown: CriterionBreakdown;
}