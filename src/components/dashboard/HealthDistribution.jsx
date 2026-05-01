import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const chartColors = {
  critical: "#ef4444",
  warning: "#f59e0b",
  healthy: "#10b981",
};

const labelMap = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
};

function normalizeDistribution(healthDistribution = []) {
  const defaultData = [
    { status: "critical", count: 0 },
    { status: "warning", count: 0 },
    { status: "healthy", count: 0 },
  ];

  const source = Array.isArray(healthDistribution) ? healthDistribution : [];

  return defaultData.map((item) => {
    const matched = source.find((row) => row.status === item.status);

    return {
      name: labelMap[item.status],
      status: item.status,
      value: Number(matched?.count || 0),
    };
  });
}

function getFallbackStats(fallbackTrend = []) {
  const trend = Array.isArray(fallbackTrend) ? fallbackTrend : [];

  if (trend.length === 0) {
    return {
      today: 0,
      yesterday: 0,
      change: 0,
    };
  }

  const today = Number(trend[trend.length - 1]?.fallbackRate || 0);
  const yesterday = Number(trend[trend.length - 2]?.fallbackRate || 0);
  const change = today - yesterday;

  return {
    today,
    yesterday,
    change,
  };
}

function HealthDistribution({ healthDistribution = [], fallbackTrend = [] }) {
  const data = normalizeDistribution(healthDistribution);
  const hasData = data.some((item) => item.value > 0);
  const fallbackStats = getFallbackStats(fallbackTrend);

  return (
    <section className="rounded-[14px] border border-slate-200 bg-white px-[25px] py-[27px] shadow-[0_1px_3px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-[18px] font-extrabold leading-none text-slate-950 dark:text-white">
        Health Distribution
      </h2>

      <div className="mx-auto mt-[18px] h-[196px] w-full max-w-[360px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={59}
                outerRadius={81}
                paddingAngle={3}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={chartColors[entry.status]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
              />

              <Legend
                verticalAlign="bottom"
                iconType="square"
                iconSize={12}
                formatter={(value) => (
                  <span className="text-[14px] text-slate-700 dark:text-slate-300">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No health data available
          </div>
        )}
      </div>

      <div className="mt-[16px] border-t border-slate-200 pt-[19px] dark:border-slate-800">
        <h3 className="text-[14px] font-bold leading-none text-slate-950 dark:text-white">
          Fallback Rate Trend
        </h3>

        <div className="mt-[13px] grid grid-cols-3 items-end gap-4">
          <div>
            <p className="text-[12px] leading-none text-slate-600 dark:text-slate-400">
              Today
            </p>
            <p className="mt-[7px] text-[20px] font-extrabold leading-none text-slate-950 dark:text-white">
              {fallbackStats.today}%
            </p>
          </div>

          <div>
            <p className="text-[12px] leading-none text-slate-600 dark:text-slate-400">
              Yesterday
            </p>
            <p className="mt-[7px] text-[20px] font-extrabold leading-none text-slate-950 dark:text-white">
              {fallbackStats.yesterday}%
            </p>
          </div>

          <div className="text-right">
            <p
              className={`text-[14px] font-bold leading-none ${
                fallbackStats.change >= 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {fallbackStats.change >= 0 ? "+" : ""}
              {fallbackStats.change}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HealthDistribution;
