export function calculateDuration(start, end) {
  const diff = (new Date(end) - new Date(start)) / (1000 * 60);
  return diff > 0 ? diff : 0;
}
