export const formatNumber = (value = 0) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("en-IN").format(number);
};

export const formatPercent = (value = 0) => {
  const number = Number(value) || 0;
  return `${number}%`;
};

export const formatSeconds = (value = 0) => {
  const number = Number(value) || 0;
  return `${number}s`;
};

export const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

export const getTodayLabel = () => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
};
