function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`rounded-[9px] border border-slate-300 bg-white px-[19px] text-[14px] font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-950 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
