/**
 * Utility functions for Persian digits and formatting
 */

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

export function formatPersianNumber(num: number, decimals = 0): string {
  const formatted = decimals > 0 ? num.toFixed(decimals) : Math.round(num).toLocaleString('en-US');
  return toPersianDigits(formatted);
}

export function formatPersianCurrency(amount: number, symbol = '$', decimals = 0): string {
  const numStr = formatPersianNumber(amount, decimals);
  return `${symbol}${numStr}`;
}

export function formatPersianPercent(pct: number, decimals = 1): string {
  const numStr = toPersianDigits(pct.toFixed(decimals));
  return `${numStr}٪`;
}
