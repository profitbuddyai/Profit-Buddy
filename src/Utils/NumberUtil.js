import { CURRENCY } from '../Enums/Enums';

export const abbreviateNumber = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num?.toString();
};

export const formatNumberWithCommas = (num, decimals = 2, wantCurrencyCode = true, withCommas = true) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';

  const formatted = new Intl.NumberFormat('en-US', {
    useGrouping: withCommas,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);

  return wantCurrencyCode ? `${CURRENCY}${formatted}` : formatted;
};

export const isASIN = (value) => {
  return /^[A-Z0-9]{10}$/.test(value);
};

export const isSellerId = (sellerId) => {
  const regex = /^A[A-Z0-9]{12,14}$/; // A + 12–14 alphanumeric
  return regex.test(sellerId);
};

export const Converters = {
  gramsToPounds: (g) => g / 453.592,
  gramsToOunce: (g) => g / 28.35,
  gramsToKilo: (g) => g / 1000,
  mmToInch: (mm) => mm / 25.4,
  mmToCm: (mm) => mm / 10,
  mmToMeter: (mm) => mm / 1000,
};

export const toCents = (value) => {
  if (!value) return 0;

  const str = String(value);

  if (str.includes('.')) {
    return Number(str.replace('.', '').replace(/^0+/, '')) || '';
  } else {
    return Number(str);
  }
};
