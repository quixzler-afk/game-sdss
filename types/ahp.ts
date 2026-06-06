export interface PairwiseComparison {
  price: number;
  metacritic: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  releaseDate: number;
}

export interface AHPWeightResult {
  price: number;
  metacritic: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  releaseDate: number;

  lambdaMax: number;
  ci: number;
  cr: number;

  isConsistent: boolean;
}