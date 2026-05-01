import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

import { formatNumber, formatPercent } from "../../utils/formatters";
import { getHealthStatusFromScore } from "../../utils/statusStyles";

const healthOptions = [
  { label: "All Status", value: "" },
  { label: "Critical", value: "critical" },
  { label: "Warning", value: "warning" },
  { label: "Healthy", value: "healthy" },
];

function getHealthColor(score, healthStatus) {
  const status = healthStatus || getHealthStatusFromScore(score);

  if (status === "healthy") {
    return "text-emerald-600 dark:text-emerald-400";
  }

  if (status === "warning") {
    return "text-amber-600 dark:text-amber-400";
  }

  return "text-red-600 dark:text-red-400";
}

function getStatusPillClass(score, healthStatus) {
  const status = healthStatus || getHealthStatusFromScore(score);

  if (status === "healthy") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  }

  if (status === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  }

  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
}

function getHealthLabel(score, healthStatus) {
  const status = healthStatus || getHealthStatusFromScore(score);

  if (status === "critical") return "Critical";
  if (status === "warning") return "Warning";
  return "Healthy";
}

function getStatusRank(score, healthStatus) {
  const status = healthStatus || getHealthStatusFromScore(score);

  if (status === "critical") return 1;
  if (status === "warning") return 2;
  return 3;
}

function formatLastActive(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getSortValue(bot, sortBy) {
  if (sortBy === "botName") {
    return String(bot.botName || "").toLowerCase();
  }

  if (sortBy === "tenantName") {
    return String(bot.tenantName || "").toLowerCase();
  }

  if (sortBy === "status") {
    return getStatusRank(bot.healthScore, bot.healthStatus);
  }

  if (sortBy === "useCase") {
    return String(bot.useCase || "").toLowerCase();
  }

  if (sortBy === "conversations") {
    return Number(bot.conversations || 0);
  }

  if (sortBy === "successRate") {
    return Number(bot.successRate || 0);
  }

  if (sortBy === "fallbackRate") {
    return Number(bot.fallbackRate || 0);
  }

  if (sortBy === "dropOffRate") {
    return Number(bot.dropOffRate || 0);
  }

  if (sortBy === "healthScore") {
    return Number(bot.healthScore || 0);
  }

  if (sortBy === "lastActive") {
    return new Date(
      bot.lastActiveAt || bot.updatedAt || bot.createdAt || 0,
    ).getTime();
  }

  return 0;
}

function compareValues(aValue, bValue, sortOrder) {
  if (typeof aValue === "string" || typeof bValue === "string") {
    const result = String(aValue).localeCompare(String(bValue));
    return sortOrder === "asc" ? result : -result;
  }

  return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
}

function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }

    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("left-ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("right-ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

function SortIcon({ columnKey, sortBy, sortOrder }) {
  if (sortBy !== columnKey) {
    return <ArrowUpDown size={13} className="text-slate-400" />;
  }

  if (sortOrder === "asc") {
    return <ArrowUp size={13} className="text-blue-600 dark:text-blue-400" />;
  }

  return <ArrowDown size={13} className="text-blue-600 dark:text-blue-400" />;
}

function SortableHeader({
  label,
  columnKey,
  sortBy,
  sortOrder,
  onSort,
  className = "",
  align = "left",
}) {
  return (
    <th
      className={`px-[13px] text-[12px] font-semibold text-slate-900 dark:text-slate-200 ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={`inline-flex items-center gap-1.5 ${
          align === "center" ? "justify-center" : "justify-start"
        } w-full text-left`}
      >
        <span>{label}</span>
        <SortIcon columnKey={columnKey} sortBy={sortBy} sortOrder={sortOrder} />
      </button>
    </th>
  );
}

function BotListTable({
  bots = [],
  pagination,
  search,
  healthFilter,
  sortBy,
  sortOrder,
  pageSize,
  isLoading,
  onSearchChange,
  onHealthFilterChange,
  onSortByChange,
  onSortOrderChange,
  onPageChange,
  onView,
}) {
  const safeBots = Array.isArray(bots) ? bots : [];

  const handleHeaderSort = (columnKey) => {
    if (sortBy === columnKey) {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
      return;
    }

    onSortByChange(columnKey);

    if (
      columnKey === "botName" ||
      columnKey === "tenantName" ||
      columnKey === "useCase"
    ) {
      onSortOrderChange("asc");
      return;
    }

    onSortOrderChange("desc");
  };

  const filteredBots = safeBots
    .filter((bot) => {
      if (!healthFilter) return true;

      const healthStatus =
        bot.healthStatus || getHealthStatusFromScore(bot.healthScore);

      return healthStatus === healthFilter;
    })
    .sort((a, b) => {
      const aValue = getSortValue(a, sortBy);
      const bValue = getSortValue(b, sortBy);

      if (sortBy === "status") {
        return sortOrder === "asc" ? bValue - aValue : aValue - bValue;
      }

      return compareValues(aValue, bValue, sortOrder);
    });

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const fromCount = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toCount = Math.min(currentPage * pageSize, total);

  return (
    <section className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-900">
      <div className="px-[24px] pb-[23px] pt-[24px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-[21px] font-extrabold leading-none tracking-[-0.01em] text-slate-950 dark:text-white">
              Bot List - Platform Wide Monitoring
            </h2>

            <p className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">
              Filter by tenant/status and click table headers to sort.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[217px]">
              <Search
                size={17}
                className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />

              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search tenant or bot..."
                className="h-[39px] rounded-[9px] pl-[40px] text-[14px]"
              />
            </div>

            <Select
              value={healthFilter}
              onChange={(event) => onHealthFilterChange(event.target.value)}
              className="h-[39px] w-full sm:w-[128px]"
            >
              {healthOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-[17px] rounded-[9px] border border-blue-200 bg-blue-50 px-[13px] py-[12px] text-[14px] text-slate-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-slate-300">
          <span className="font-medium">Health Score Logic:</span> Healthy:
          80-100 | Warning: 60-79 | Critical: Below 60
        </div>
      </div>

      <div className="table-scroll border-t border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[1180px] border-collapse">
          <thead>
            <tr className="h-[56px] bg-slate-50 dark:bg-slate-950">
              <SortableHeader
                label="Bot Name"
                columnKey="botName"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[165px]"
              />

              <SortableHeader
                label="Tenant / Client"
                columnKey="tenantName"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[170px]"
              />

              <SortableHeader
                label="Status"
                columnKey="status"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[120px]"
              />

              <SortableHeader
                label="Use Case"
                columnKey="useCase"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[150px]"
              />

              <SortableHeader
                label="Usage"
                columnKey="conversations"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[92px]"
                align="center"
              />

              <SortableHeader
                label="Success"
                columnKey="successRate"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[92px]"
                align="center"
              />

              <SortableHeader
                label="Fallback"
                columnKey="fallbackRate"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[92px]"
                align="center"
              />

              <SortableHeader
                label="Drop-off"
                columnKey="dropOffRate"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[92px]"
                align="center"
              />

              <SortableHeader
                label="Score"
                columnKey="healthScore"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[105px]"
                align="center"
              />

              <SortableHeader
                label="Last Active"
                columnKey="lastActive"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleHeaderSort}
                className="w-[130px]"
              />

              <th className="w-[220px] px-[13px] text-left text-[12px] font-semibold text-slate-900 dark:text-slate-200">
                Recommended Action
              </th>

              <th className="w-[80px] px-[13px] text-center text-[12px] font-semibold text-slate-900 dark:text-slate-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <tr
                  key={`loading-row-${index}`}
                  className="h-[92px] border-t border-slate-200 dark:border-slate-800"
                >
                  {Array.from({ length: 12 }).map((__, cellIndex) => (
                    <td key={`loading-cell-${cellIndex}`} className="px-[13px]">
                      <div className="h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredBots.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center">
                  <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
                    No bots found
                  </p>

                  <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                    Try changing search, status filter, or dashboard filters.
                  </p>
                </td>
              </tr>
            ) : (
              filteredBots.map((bot) => {
                const healthStatus =
                  bot.healthStatus || getHealthStatusFromScore(bot.healthScore);

                return (
                  <tr
                    key={bot._id}
                    className="h-[92px] border-t border-slate-200 bg-white text-[14px] text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <td className="px-[13px] align-middle">
                      <div className="max-w-[145px] font-semibold leading-[20px] text-slate-950 dark:text-slate-100">
                        {bot.botName || "-"}
                      </div>
                    </td>

                    <td className="px-[13px] align-middle">
                      <div className="font-bold leading-[20px] text-slate-950 dark:text-slate-100">
                        {bot.tenantName || "-"}
                      </div>

                      {bot.tenantCode ? (
                        <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                          {bot.tenantCode}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-[13px] align-middle">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[12px] font-bold ${getStatusPillClass(
                          bot.healthScore,
                          healthStatus,
                        )}`}
                      >
                        {getHealthLabel(bot.healthScore, healthStatus)}
                      </span>
                    </td>

                    <td className="px-[13px] align-middle">
                      <div className="max-w-[135px] leading-[20px] text-slate-700 dark:text-slate-300">
                        {bot.useCase || "-"}
                      </div>
                    </td>

                    <td className="px-[13px] text-center align-middle">
                      {formatNumber(bot.conversations || 0)}
                    </td>

                    <td className="px-[13px] text-center align-middle">
                      {formatPercent(bot.successRate || 0)}
                    </td>

                    <td className="px-[13px] text-center align-middle">
                      {formatPercent(bot.fallbackRate || 0)}
                    </td>

                    <td className="px-[13px] text-center align-middle">
                      {formatPercent(bot.dropOffRate || 0)}
                    </td>

                    <td className="px-[13px] text-center align-middle">
                      <span
                        className={`text-[15px] font-extrabold ${getHealthColor(
                          bot.healthScore,
                          healthStatus,
                        )}`}
                      >
                        {bot.healthScore || 0}
                      </span>
                    </td>

                    <td className="px-[13px] align-middle">
                      <div className="leading-[18px] text-slate-700 dark:text-slate-300">
                        {formatLastActive(
                          bot.lastActiveAt || bot.updatedAt || bot.createdAt,
                        )}
                      </div>
                    </td>

                    <td className="px-[13px] align-middle">
                      <div className="max-w-[205px] leading-[20px] text-slate-800 dark:text-slate-200">
                        {bot.recommendedAction ||
                          "Continue monitoring performance."}
                      </div>
                    </td>

                    <td className="px-[13px] text-center align-middle">
                      <button
                        type="button"
                        onClick={() => onView?.(bot)}
                        className="text-[14px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end border-t border-slate-200 px-[24px] py-[14px] dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="mr-2 text-[13px] text-slate-500 dark:text-slate-400">
            {formatNumber(fromCount)}-{formatNumber(toCount)} of{" "}
            {formatNumber(total)}
          </span>

          <Button
            variant="secondary"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-[34px] px-3"
          >
            <ChevronLeft size={16} />
          </Button>

          {pageNumbers.map((page) => {
            if (typeof page === "string") {
              return (
                <span
                  key={page}
                  className="inline-flex h-[34px] items-center px-1 text-[13px] font-bold text-slate-400"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange(page)}
                className={
                  isActive
                    ? "inline-flex h-[34px] min-w-[36px] items-center justify-center rounded-[9px] border border-blue-600 bg-blue-600 px-3 text-[13px] font-bold text-white shadow-sm"
                    : "inline-flex h-[34px] min-w-[36px] items-center justify-center rounded-[9px] border border-slate-200 bg-white px-3 text-[13px] font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                }
              >
                {page}
              </button>
            );
          })}

          <Button
            variant="secondary"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-[34px] px-3"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default BotListTable;
