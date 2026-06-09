import { GameAlternative } from "./game";

export interface AHPWeights {
  price: number;
  metacritic: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  releaseDate: number;
}

export interface CriterionBreakdown {
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

  breakdown: CriterionBreakdown;
}

export interface RecommendationHistoryPayload {
  user_id: string;

  platform: string;

  genre: string;

  recommendation_name: string;

  ahp_weights: AHPWeights;

  recommendation_result: RankedGame[];
}

export type { GameAlternative };
