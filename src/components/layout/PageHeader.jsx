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
    <header className="border-b border-slate-200 bg-white px-[18px] py-[16px] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-blue-600 dark:text-blue-400">
              <Bot size={28} strokeWidth={2.4} />
            </div>

            <p className="text-[20px] font-semibold leading-none text-slate-950 dark:text-white">
              AI Ops Monitor
            </p>
          </div>

          <h1 className="mt-[13px] text-[24px] font-extrabold leading-none tracking-[-0.02em] text-slate-950 dark:text-white">
            Bot Usage Monitoring
          </h1>

          <p className="mt-[6px] text-[14px] leading-none text-slate-600 dark:text-slate-400">
            Platform-wide daily health view across all tenants and bots
          </p>
        </div>

        <div className="mt-[20px] flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-[38px] items-center gap-2 rounded-[9px] border border-slate-300 bg-white px-[16px] text-[14px] font-medium text-slate-950 shadow-[0_1px_1px_rgba(15,23,42,0.03)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <CalendarDays size={16} />
            <span>May 1, 2026</span>
            <ChevronDown size={15} />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-[38px] items-center gap-2 rounded-[9px] border border-slate-300 bg-white px-[14px] text-[14px] font-semibold text-slate-950 shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-[38px] items-center gap-2 rounded-[9px] border border-slate-300 bg-white px-[16px] text-[14px] font-semibold text-slate-950 shadow-[0_1px_1px_rgba(15,23,42,0.03)] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
