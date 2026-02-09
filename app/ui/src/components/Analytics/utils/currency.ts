const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const getCurrencySymbol = (currency: string): string =>
  CURRENCY_SYMBOLS[currency] || currency;

export const formatAmount = (amount: number, currency: string): string =>
  `${getCurrencySymbol(currency)}${amount.toLocaleString('en-IN')}`;
