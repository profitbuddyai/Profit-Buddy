export const getDomainWithPadding = (values, percentage = 0.1, minFloor = [0]) => {
  const nums = (values || []).map(Number).filter((v) => Number.isFinite(v));

  //   if (!nums.length) return [minFloor, minFloor + 1];

  let min = Math.min(...minFloor);
  let max = Math.max(...nums);

  // If all values equal, create a small range around them
  if (max === min) {
    const pad = Math.max(Math.abs(max) * percentage, 0);
    const paddedMin = Math.max(0, min - pad);
    const paddedMax = max + pad;
    return [Math.floor(paddedMin), Math.ceil(paddedMax)];
  }

  const pad = (max - min) * percentage;

  const paddedMin = Math.max(0, min - min * percentage);
  const paddedMax = max + pad;

  // Round outwards so ticks look nicer
  return [Math.floor(paddedMin), Math.ceil(paddedMax)];
};

export const getEvenlySpacedTicks = (data, count) => {
  if (!data || data.length === 0) return [];

  if (count === 1) return [data[0].date];
  if (count >= data.length) return data.map((d) => d.date);

  const step = (data.length - 1) / (count - 1);

  const ticks = [];
  for (let i = 0; i < count; i++) {
    const index = Math.round(i * step);
    // const formatedDate = formatDate();
    ticks.push(data[index]?.date);
  }

  return ticks;
};

export const generateTicks = (min, max, step = 5) => {
  const ticks = [];
  const range = max - min;
  const interval = Math.max(1, Math.floor(range / step));

  for (let i = min; i <= max; i += interval) {
    ticks.push(i);
  }

  // Ensure first and last are included
  if (!ticks.includes(min)) ticks.unshift(min);
  if (!ticks.includes(max)) ticks.push(max);

  return ticks;
};
export const formatYear = (date = '') => {
  if (!date) return;
  return new Date(date).getFullYear();
};

export const formatDate = (date = '') => {
  if (!date) return;
  const locale = 'en-US';
  const dateFormatOptions = { month: 'short', day: 'numeric' };

  return new Date(date).toLocaleDateString(locale, dateFormatOptions);
};

export const formatTime = (date = '') => {
  if (!date) return;
  const locale = 'en-US';
  const timeFormatOptions = { hour: '2-digit', hour12: false, minute: '2-digit' };

  return new Date(date).toLocaleTimeString(locale, timeFormatOptions);
};

export const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size &&
    prevProps.showLegend === nextProps.showLegend &&
    prevProps.graphKeys === nextProps.graphKeys &&
    JSON.stringify(prevProps.graphData) === JSON.stringify(nextProps.graphData)
  );
};

export function calculateZoomRange(left, right) {
  if (!left || !right) return null;

  const diffMs = Math.abs(right - left);

  return {
    ms: diffMs,
    seconds: diffMs / 1000,
    minutes: diffMs / (1000 * 60),
    hours: diffMs / (1000 * 60 * 60),
    days: diffMs / (1000 * 60 * 60 * 24),
    months: diffMs / (1000 * 60 * 60 * 24 * 30), // rough estimate
    years: diffMs / (1000 * 60 * 60 * 24 * 365), // rough estimate
  };
}

// Formats a single tick label based on the current zoom range
export const formatDateTick = (timestamp, left, right) => {
  if (!left || !right) return null;

  const zoomRange = calculateZoomRange(left, right);
  const date = new Date(timestamp);

  if (zoomRange > 180 * 24 * 3600 * 1000) {
    // > 6 months
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } else if (zoomRange > 30 * 24 * 3600 * 1000) {
    // > 1 month
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (zoomRange > 24 * 3600 * 1000) {
    // > 1 day
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  } else {
    // < 1 day → show hours/mins
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
};

// Generates an array of ticks depending on zoom range
export const getAdaptiveTicks = (start, end) => {
  const ticks = [];
  const zoomRange = end - start;

  let step;

  if (zoomRange > 180 * 24 * 3600 * 1000) {
    step = 30 * 24 * 3600 * 1000; // 1 month
  } else if (zoomRange > 30 * 24 * 3600 * 1000) {
    step = 7 * 24 * 3600 * 1000; // 1 week
  } else if (zoomRange > 10 * 24 * 3600 * 1000) {
    step = 2 * 24 * 3600 * 1000; // 2 days
  } else if (zoomRange > 24 * 3600 * 1000) {
    step = 24 * 3600 * 1000; // 1 day
  } else {
    step = 5 * 60 * 1000; // 5 minutes
  }

  for (let t = start; t <= end; t += step) {
    ticks.push(t);
  }
  return ticks;
};

function generateEqualTimestamps(startMs, endMs, count = 100) {
  if (count < 2) return [startMs, endMs];

  const gap = (endMs - startMs) / (count - 1);
  const timestamps = [];

  for (let i = 0; i < count; i++) {
    timestamps.push(Math.round(startMs + gap * i));
  }

  return timestamps;
}

function findMinMax(data, keys) {
  let min = Infinity;
  let max = -Infinity;

  for (const item of data) {
    for (const key of keys) {
      const value = item[key];
      if (typeof value === 'number') {
        if (value < min) min = value;
        if (value > max) max = value;
      }
    }
  }

  return { min, max };
}

function applyPercentage(num, method, percentage) {
  const change = (num * percentage) / 100;

  if (method === 'add') {
    return Math.ceil(num + change);
  } else if (method === 'sub') {
    return Math.max(0, Math.floor(num - change));
  } else {
    return num;
  }
}

export const lightenColor = (hex, amount = 0.7) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // interpolate towards white
  r = Math.round(r + (255 - r) * amount);
  g = Math.round(g + (255 - g) * amount);
  b = Math.round(b + (255 - b) * amount);

  return `rgb(${r}, ${g}, ${b})`;
};

export const getSellerByTimestamp = (targetTimestamp, history, sellerData) => {
  if (!Array.isArray(history) || history.length === 0) return null;

  const sorted = [...history].sort((a, b) => a.date - b.date);

  if (targetTimestamp < sorted[0].date) return null;

  let result = null;
  for (const record of sorted) {
    if (record.date <= targetTimestamp) {
      result = record;
    } else {
      break;
    }
  }

  return sellerData?.[result?.sellerId] ?? null;
};
