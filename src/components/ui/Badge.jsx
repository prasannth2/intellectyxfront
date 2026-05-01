function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-950 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
