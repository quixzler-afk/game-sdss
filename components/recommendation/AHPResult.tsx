interface Props {
  weights: number[];
  criteria: string[];
  cr: number;
  ci: number;
  lambdaMax: number;
}

export default function AHPResult({
  weights,
  criteria,
  cr,
  ci,
  lambdaMax,
}: Props) {
  return (
    <div
      className="
        bg-[#111C33]
        rounded-2xl
        p-6
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-4
        "
      >
        Hasil AHP
      </h2>

      <div className="space-y-2">
        {criteria.map(
          (item, index) => (
            <div
              key={item}
              className="
                flex
                justify-between
              "
            >
              <span>{item}</span>

              <span>
                {weights[
                  index
                ]?.toFixed(4)}
              </span>
            </div>
          )
        )}
      </div>

      <div className="mt-6">
        <p>
          λmax:
          {" "}
          {lambdaMax}
        </p>

        <p>
          CI:
          {" "}
          {ci}
        </p>

        <p>
          CR:
          {" "}
          {cr}
        </p>

        <p
          className={
            cr < 0.1
              ? "text-green-400"
              : "text-red-400"
          }
        >
          {cr < 0.1
            ? "Konsisten"
            : "Tidak Konsisten"}
        </p>
      </div>
    </div>
  );
}