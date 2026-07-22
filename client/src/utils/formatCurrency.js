/**
 * Formats a numeric price into Indian Rupee (INR - ₹) currency format.
 * Example: 2500000 => "₹25,00,000" or 500000 => "₹5,00,000"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatCurrency;
