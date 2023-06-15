export function pad(n: number, length: number = 2) {
  return n.toString().padStart(length, '0');
}
export function getDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
export function getTime(dateStr: string) {
  const date = new Date(dateStr);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}