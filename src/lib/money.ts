export function toZar(price: number, currency: string) {
  if (currency === "ZAR") return price;
  const rate = Number(process.env.NEXT_PUBLIC_USD_TO_ZAR || "19.0");
  if (currency === "USD") return price * rate;
  return price;
}

export function formatZar(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}
