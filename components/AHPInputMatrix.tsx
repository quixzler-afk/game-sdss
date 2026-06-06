"use client";

import { useState } from "react";

const CRITERIA = [
  "price",
  "metacritic",
  "popularity",
  "rating",
  "reviewCount",
  "releaseDate",
];

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function AHPInputMatrix({
  onChange,
}: {
  onChange: (matrix: number[][]) => void;
}) {
  const size = CRITERIA.length;

  const [matrix, setMatrix] = useState<number[][]>(
    Array(size)
      .fill(0)
      .map(() => Array(size).fill(1))
  );

  const handleChange = (i: number, j: number, value: number) => {
    const newMatrix = matrix.map((row) => [...row]);

    newMatrix[i][j] = value;
    newMatrix[j][i] = 1 / value;

    setMatrix(newMatrix);
    onChange(newMatrix);
  };

  return (
    <div className="bg-[#111C33] p-4 rounded-xl border border-slate-800 mt-6">
      <h2 className="text-lg font-bold mb-3">
        AHP Pairwise Comparison
      </h2>

      <div className="space-y-4">
        {CRITERIA.map((row, i) =>
          CRITERIA.map((col, j) => {
            if (i >= j) return null;

            return (
              <div
                key={`${i}-${j}`}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-slate-300">
                  {row} vs {col}
                </span>

                <select
                  className="bg-[#0B1020] border border-slate-700 p-2 rounded"
                  value={matrix[i][j]}
                  onChange={(e) =>
                    handleChange(
                      i,
                      j,
                      Number(e.target.value)
                    )
                  }
                >
                  {SCALE.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}