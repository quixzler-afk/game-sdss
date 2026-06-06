import { AHPWeights } from "../types/recommendation";

export interface AHPResult {
  weights: number[];

  ahpWeights: AHPWeights;

  lambdaMax: number;

  ci: number;

  cr: number;

  isConsistent: boolean;
}

const RANDOM_INDEX: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

export function mapAHPWeights(weights: number[]): AHPWeights {
  return {
    price: weights[0] ?? 0,
    metacritic: weights[1] ?? 0,
    popularity: weights[2] ?? 0,
    rating: weights[3] ?? 0,
    reviewCount: weights[4] ?? 0,
    releaseDate: weights[5] ?? 0,
  };
}

export function normalizeMatrix(matrix: number[][]) {
  const size = matrix.length;

  const columnSums = Array(size).fill(0);

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      columnSums[col] += matrix[row][col];
    }
  }

  return matrix.map((row) => row.map((value, col) => value / columnSums[col]));
}

export function calculateAHP(matrix: number[][]): AHPResult {
  const normalized = normalizeMatrix(matrix);

  const weights = normalized.map(
    (row) => row.reduce((a, b) => a + b, 0) / row.length,
  );

  const weightedSum = matrix.map((row) =>
    row.reduce((sum, value, index) => sum + value * weights[index], 0),
  );

  const lambdaMax =
    weightedSum.reduce((sum, value, index) => sum + value / weights[index], 0) /
    matrix.length;

  const ci = (lambdaMax - matrix.length) / (matrix.length - 1);

  const ri = RANDOM_INDEX[matrix.length] ?? 1.49;

  const cr = ri === 0 ? 0 : ci / ri;

  return {
    weights,

    ahpWeights: mapAHPWeights(weights),

    lambdaMax: Number(lambdaMax.toFixed(4)),

    ci: Number(ci.toFixed(4)),

    cr: Number(cr.toFixed(4)),

    isConsistent: cr < 0.1,
  };
}

export function calculateAHPFromSliders(sliders: Record<string, number>) {
  const total = Object.values(sliders).reduce((a, b) => a + b, 0);

  const weights: AHPWeights = {
    price: sliders.price / total,
    metacritic: sliders.metacritic / total,
    popularity: sliders.popularity / total,
    rating: sliders.rating / total,
    reviewCount: sliders.reviewCount / total,
    releaseDate: sliders.releaseDate / total,
  };

  return {
    weights,
    raw: sliders,
  };
}
