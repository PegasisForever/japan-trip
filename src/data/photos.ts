/** Photos are stored in three sizes: /photos/t/ (320px square, pins), /photos/m/ (640px, cards) and /photos/ (1280px) */
export function photoUrl(file: string, width: number) {
  // A photo linked from Wikimedia is used as it is
  if (/^https?:/.test(file)) return file
  if (width <= 200) return `/photos/t/${file}`
  if (width <= 640) return `/photos/m/${file}`
  return `/photos/${file}`
}
