"use client";

interface Props {
  matrix: number[][];
  onChange: (
    row: number,
    col: number,
    value: number
  ) => void;
  criteria: string[];
}

export default function AHPMatrix({
  matrix,
  onChange,
  criteria,
}: Props) {
  return (
    <div className="overflow-auto">
      <table
        className="
          w-full
          border-collapse
        "
      >
        <thead>
          <tr>
            <th className="p-3">
              Criteria
            </th>

            {criteria.map((item) => (
              <th
                key={item}
                className="p-3"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {matrix.map(
            (row, rowIndex) => (
              <tr key={rowIndex}>
                <td
                  className="
                    p-3
                    font-semibold
                  "
                >
                  {
                    criteria[
                      rowIndex
                    ]
                  }
                </td>

                {row.map(
                  (
                    value,
                    colIndex
                  ) => (
                    <td
                      key={
                        colIndex
                      }
                      className="p-2"
                    >
                      {rowIndex ===
                      colIndex ? (
                        <div
                          className="
                            text-center
                          "
                        >
                          1
                        </div>
                      ) : (
                        <select
                          value={
                            value
                          }
                          onChange={(
                            e
                          ) =>
                            onChange(
                              rowIndex,
                              colIndex,
                              Number(
                                e
                                  .target
                                  .value
                              )
                            )
                          }
                          className="
                            bg-[#16213E]
                            rounded
                            p-2
                            w-full
                          "
                        >
                          {[
                            1 / 9,
                            1 / 8,
                            1 / 7,
                            1 / 6,
                            1 / 5,
                            1 / 4,
                            1 / 3,
                            1 / 2,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                          ].map(
                            (
                              option
                            ) => (
                              <option
                                key={
                                  option
                                }
                                value={
                                  option
                                }
                              >
                                {
                                  option
                                }
                              </option>
                            )
                          )}
                        </select>
                      )}
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}