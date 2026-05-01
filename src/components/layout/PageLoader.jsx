function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />

        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading AI Ops Monitor...
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
