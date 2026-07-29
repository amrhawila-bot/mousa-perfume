export function formatPrice(price: number) {
  return `${price.toLocaleString("ar-SA")} جنيه`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
