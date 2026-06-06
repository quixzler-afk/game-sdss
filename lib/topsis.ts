import {
  AHPWeights,
  GameAlternative,
  RankedGame,
} from "../types/recommendation";

export type TOPSISCriteria = {
  key: keyof AHPWeights;
  type: "benefit" | "cost";
};

/**
 * Normalisasi vector (TOPSIS standard)
 */
export function normalizeVector(values: number[]): number[] {
  const denominator = Math.sqrt(
    values.reduce((sum, v) => sum + v * v, 0)
  );

  if (denominator === 0) return values.map(() => 0);

  return values.map((v) => v / denominator);
}

/**
 * MAIN TOPSIS ALGORITHM
 */
export function calculateTOPSIS(
  games: GameAlternative[],
  criteria: TOPSISCriteria[],
  weights: AHPWeights
): RankedGame[] {
  if (!games.length) return [];

  // =========================
  // 1. BUILD MATRIX
  // =========================
  const matrix: Record<string, number[]> = {
    price: [],
    metacritic: [],
    popularity: [],
    rating: [],
    reviewCount: [],
    releaseDate: [],
  };

  games.forEach((g) => {
    matrix.price.push(g.price);
    matrix.metacritic.push(g.metacritic);
    matrix.popularity.push(g.popularity);
    matrix.rating.push(g.rating);
    matrix.reviewCount.push(g.reviewCount);
    matrix.releaseDate.push(g.releaseDate);
  });

  // =========================
  // 2. NORMALIZATION
  // =========================
  const normalized: Record<string, number[]> = {
    price: normalizeVector(matrix.price),
    metacritic: normalizeVector(matrix.metacritic),
    popularity: normalizeVector(matrix.popularity),
    rating: normalizeVector(matrix.rating),
    reviewCount: normalizeVector(matrix.reviewCount),
    releaseDate: normalizeVector(matrix.releaseDate),
  };

  // =========================
  // 3. WEIGHTED NORMALIZATION
  // =========================
  const weighted: Record<string, number[]> = {
    price: normalized.price.map((v) => v * weights.price),
    metacritic: normalized.metacritic.map((v) => v * weights.metacritic),
    popularity: normalized.popularity.map((v) => v * weights.popularity),
    rating: normalized.rating.map((v) => v * weights.rating),
    reviewCount: normalized.reviewCount.map((v) => v * weights.reviewCount),
    releaseDate: normalized.releaseDate.map((v) => v * weights.releaseDate),
  };

  // =========================
  // 4. IDEAL SOLUTION
  // =========================
  const positiveIdeal = {
    price: Math.min(...weighted.price),
    metacritic: Math.max(...weighted.metacritic),
    popularity: Math.max(...weighted.popularity),
    rating: Math.max(...weighted.rating),
    reviewCount: Math.max(...weighted.reviewCount),
    releaseDate: Math.max(...weighted.releaseDate),
  };

  const negativeIdeal = {
    price: Math.max(...weighted.price),
    metacritic: Math.min(...weighted.metacritic),
    popularity: Math.min(...weighted.popularity),
    rating: Math.min(...weighted.rating),
    reviewCount: Math.min(...weighted.reviewCount),
    releaseDate: Math.min(...weighted.releaseDate),
  };

  // =========================
  // 5. DISTANCE + SCORE
  // =========================
  const result = games.map((game, index) => {
    const dPlus =
      Math.pow(weighted.price[index] - positiveIdeal.price, 2) +
      Math.pow(weighted.metacritic[index] - positiveIdeal.metacritic, 2) +
      Math.pow(weighted.popularity[index] - positiveIdeal.popularity, 2) +
      Math.pow(weighted.rating[index] - positiveIdeal.rating, 2) +
      Math.pow(weighted.reviewCount[index] - positiveIdeal.reviewCount, 2) +
      Math.pow(weighted.releaseDate[index] - positiveIdeal.releaseDate, 2);

    const dMinus =
      Math.pow(weighted.price[index] - negativeIdeal.price, 2) +
      Math.pow(weighted.metacritic[index] - negativeIdeal.metacritic, 2) +
      Math.pow(weighted.popularity[index] - negativeIdeal.popularity, 2) +
      Math.pow(weighted.rating[index] - negativeIdeal.rating, 2) +
      Math.pow(weighted.reviewCount[index] - negativeIdeal.reviewCount, 2) +
      Math.pow(weighted.releaseDate[index] - negativeIdeal.releaseDate, 2);

    const distancePlus = Math.sqrt(dPlus);
    const distanceMinus = Math.sqrt(dMinus);

    const score =
      distanceMinus / (distancePlus + distanceMinus);

    return {
      ...game,

      topsisScore: Number(score.toFixed(4)),

      rank: 0,

      // =========================
      // EXPLAINABILITY BREAKDOWN
      // =========================
      breakdown: {
        price: weighted.price[index],
        metacritic: weighted.metacritic[index],
        popularity: weighted.popularity[index],
        rating: weighted.rating[index],
        reviewCount: weighted.reviewCount[index],
        releaseDate: weighted.releaseDate[index],
      },

      distance: {
        positive: distancePlus,
        negative: distanceMinus,
      },
    };
  });

  // =========================
  // 6. SORTING + RANKING
  // =========================
  return result
    .sort((a, b) => b.topsisScore - a.topsisScore)
    .map((g, i) => ({
      ...g,
      rank: i + 1,
    }));
}