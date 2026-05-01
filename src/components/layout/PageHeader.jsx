import {
  Bot,
  CalendarDays,
  ChevronDown,
  Moon,
  RefreshCcw,
  Sun,
} from "lucide-react";

function PageHeader({ theme, onToggleTheme, onRefresh, isRefreshing }) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-[18px] sm:py-[16px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="shrink-0 text-blue-600 dark:text-blue-400">
              <Bot size={28} strokeWidth={2.4} />
            </div>

            <p className="truncate text-[18px] font-semibold leading-none text-slate-950 dark:text-white sm:text-[20px]">
              AI Ops Monitor
            </p>
          </div>

          <h1 className="mt-3 text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-slate-950 dark:text-white sm:text-[24px]">
            Bot Usage Monitoring
          </h1>

          <p className="mt-2 max-w-full text-[14px] leading-snug text-slate-600 dark:text-slate-400 sm:leading-none">
            Platform-wide daily health view across all tenants and bots
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:mt-[20px] lg:w-auto lg:flex-nowrap lg:gap-3">
          <button
            type="button"
            className="inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-[9px] border border-slate-300 bg-white px-4 text-[14px] font-medium text-slate-950 shadow-[0_1px_1px_rgba(15,23,42,0.03)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-auto"
          >
            <CalendarDays size={16} />
            <span>May 1, 2026</span>
            <ChevronDown size={15} />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-[9px] border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-950 shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:w-auto"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-[9px] border border-slate-300 bg-white px-4 text-[14px] font-semibold text-slate-950 shadow-[0_1px_1px_rgba(15,23,42,0.03)] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-auto"
          >
            <RefreshCcw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
