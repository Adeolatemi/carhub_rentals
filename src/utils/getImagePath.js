export function getImagePath(filename) {
  const base = import.meta.env.BASE_URL || '';
  return `${base}images/${filename}`;
}
