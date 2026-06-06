import { formatRupiah } from "../lib/currency";

interface Props {
  value?: number;
  className?: string;
}

export default function CurrencyText({
  value,
  className,
}: Props) {
  return (
    <span className={className}>
      {formatRupiah(value)}
    </span>
  );
}