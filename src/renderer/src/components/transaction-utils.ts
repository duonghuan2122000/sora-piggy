export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const signOfAmount = (amount: number): string => {
  return Number(amount) >= 0 ? '+' : '-';
};

export const isIncomeCategory = (category?: string): boolean => {
  return (category || '').toString().toLowerCase() === 'income';
};
