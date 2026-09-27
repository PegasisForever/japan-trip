/** Photos are stored in three sizes: /photos/t/ (320px square, pins), /photos/m/ (640px, cards) and /photos/ (1280px) */
export function photoUrl(file: string, width: number) {
  // A photo linked from Wikimedia is used as it is
  if (/^https?:/.test(file)) return file
  // BASE_URL: "/" here, "/japan-trip/" on GitHub Pages
  const base = import.meta.env.BASE_URL
  if (width <= 200) return `${base}photos/t/${file}`
  if (width <= 640) return `${base}photos/m/${file}`
  return `${base}photos/${file}`
}
