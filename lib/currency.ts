export function formatRupiah(
  value?: number | null
) {
  if (
    value === undefined ||
    value === null
  ) {
    return "Rp 0";
  }

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

export function usdToIdr(
  usd: number,
  rate = 16000
) {
  return Math.round(
    usd * rate
  );
}
