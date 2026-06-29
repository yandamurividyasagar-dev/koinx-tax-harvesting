export const formatCurrency = (val: number, decimals = 2): string => {
  if (Math.abs(val) < 0.01 && val !== 0) return `₹${val.toExponential(2)}`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
};

export const formatNumber = (val: number, decimals = 6): string => {
  if (Math.abs(val) < 1e-6 && val !== 0) return val.toExponential(3);
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(val);
};

export const formatGain = (val: number): string => {
  const prefix = val >= 0 ? '+' : '';
  return `${prefix}${formatCurrency(val)}`;
};

export const isPositive = (val: number) => val >= 0;

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (pass: string): string | null => {
  if (pass.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(pass)) return 'Include at least one uppercase letter.';
  if (!/[0-9]/.test(pass)) return 'Include at least one number.';
  return null;
};
