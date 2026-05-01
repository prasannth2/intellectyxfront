export const normalizeStatus = (status = "") => {
  return String(status).toLowerCase().trim();
};

export const getHealthStatusFromScore = (score = 0) => {
  const value = Number(score) || 0;

  if (value >= 80) return "healthy";
  if (value >= 60) return "warning";
  return "critical";
};

export const getStatusLabel = (status = "") => {
  const normalized = normalizeStatus(status);

  if (normalized === "critical") return "Critical";
  if (normalized === "warning") return "Warning";
  if (normalized === "healthy") return "Healthy";
  if (normalized === "active") return "Active";
  if (normalized === "inactive") return "Inactive";
  if (normalized === "info") return "Info";

  return status || "Unknown";
};

export const getStatusBadgeClass = (status = "") => {
  const normalized = normalizeStatus(status);

  if (normalized === "critical") {
    return "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300";
  }

  if (normalized === "warning") {
    return "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300";
  }

  if (normalized === "healthy" || normalized === "active") {
    return "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";
  }

  if (normalized === "inactive") {
    return "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }

  return "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300";
};
