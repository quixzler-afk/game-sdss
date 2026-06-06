interface Props {
  data: any[];
}

export default function RecommendationTable({
  data,
}: Props) {
  return (
    <div
      className="
        bg-[#111C33]
        rounded-2xl
        p-6
      "
    >
      <table className="w-full">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Game</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {data.map(
            (game, index) => (
              <tr key={game.id}>
                <td>
                  {index + 1}
                </td>

                <td>
                  {game.name}
                </td>

                <td>
                  {game.score.toFixed(
                    4
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}