// Currency symbol mapping
const currencySymbols: Record<string, string> = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£',
    'AUD': 'A$',
    'CAD': 'C$',
    'JPY': '¥',
};

/**
 * Get currency symbol from currency code
 * @param currency - Currency code (e.g., 'USD', 'INR')
 * @returns Currency symbol (e.g., '$', '₹')
 */
export const getCurrencySymbol = (currency?: string): string => {
    if (!currency) return '₹'; // Default to INR
    return currencySymbols[currency.toUpperCase()] || currency;
};

/**
 * Format budget with currency symbol
 * @param budget - Budget amount
 * @param currency - Currency code
 * @returns Formatted budget string (e.g., '$500.00', '₹1,000')
 */
export const formatBudget = (budget: number, currency?: string): string => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${budget?.toLocaleString() ?? 0}`;
};
