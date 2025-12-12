export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
export function formatMoney(value: number) {
  return `$${value.toFixed(2)}`
}
