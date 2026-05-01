export const THEME_STORAGE_KEY = "ai_ops_monitor_theme";

export const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)",
  )?.matches;

  return prefersDark ? "dark" : "light";
};

export const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
};
