export function formatPrice(amount: number): string {
  return `K${new Intl.NumberFormat("en-US").format(amount)}`;
}

export function numberFromSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 99;
  }
  return (hash % 33) + 1;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BJ-${stamp}-${rand}`;
}
