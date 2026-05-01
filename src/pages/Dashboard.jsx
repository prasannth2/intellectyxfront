import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import AdminChatbot from "../components/dashboard/AdminChatbot";
import BotListTable from "../components/dashboard/BotListTable";
import FilterBar from "../components/dashboard/FilterBar";
import HealthDistribution from "../components/dashboard/HealthDistribution";
import InsightCard from "../components/dashboard/InsightCard";
import SummaryCards from "../components/dashboard/SummaryCards";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";

import { getBots, getDashboard, getTenants } from "../services/api";
import { safeArray } from "../utils/formatters";

// const initialFilters = {
//   dateRange: "today",
//   tenantId: "",
//   botId: "",
//   status: "",
//   useCase: "",
// };

const FIXED_DASHBOARD_DATE = "2026-05-01";

const initialFilters = {
  tenantId: "",
  botId: "",
  status: "",
  useCase: "",
};

const defaultPagination = {
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

function Dashboard({ theme, onToggleTheme }) {
  const [filters, setFilters] = useState(initialFilters);

  const [dashboardData, setDashboardData] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [bots, setBots] = useState([]);

  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [tableSearch, setTableSearch] = useState("");
  const [tableHealthFilter, setTableHealthFilter] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [tableLimit, setTableLimit] = useState(10);
  const [tableBots, setTableBots] = useState([]);
  const [tablePagination, setTablePagination] = useState(defaultPagination);
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  const [tableSortBy, setTableSortBy] = useState("status");
  const [tableSortOrder, setTableSortOrder] = useState("desc");

  const handleSortByChange = (value) => {
    setTableSortBy(value);
    setTablePage(1);
  };

  const handleSortOrderChange = (value) => {
    setTableSortOrder(value);
    setTablePage(1);
  };
  const dashboardParams = useMemo(() => {
    const params = {
      date: FIXED_DASHBOARD_DATE,
      fromDate: FIXED_DASHBOARD_DATE,
      toDate: FIXED_DASHBOARD_DATE,
    };

    if (filters.tenantId) params.tenantId = filters.tenantId;
    if (filters.botId) params.botId = filters.botId;
    if (filters.status) params.status = filters.status;
    if (filters.useCase) params.useCase = filters.useCase;

    return params;
  }, [filters.tenantId, filters.botId, filters.status, filters.useCase]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const response = await getDashboard(dashboardParams);

        if (!isMounted) return;

        if (response?.status !== 1) {
          throw new Error(response?.message || "Failed to load dashboard");
        }

        setDashboardData(response?.data || {});
        setError("");
      } catch (err) {
        if (!isMounted) return;

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Dashboard API failed";

        setError(message);
        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoadingDashboard(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [dashboardParams, refreshKey]);

  useEffect(() => {
    let isMounted = true;

    const fetchFilterData = async () => {
      try {
        const [tenantResponse, botResponse] = await Promise.all([
          getTenants(),
          getBots({
            tenantId: filters.tenantId || undefined,
            limit: 100,
          }),
        ]);

        if (!isMounted) return;

        if (tenantResponse?.status === 1) {
          setTenants(safeArray(tenantResponse?.data));
        }

        if (botResponse?.status === 1) {
          setBots(safeArray(botResponse?.data?.bots));
        }
      } catch (err) {
        if (!isMounted) return;

        const message =
          err?.response?.data?.message || err?.message || "Filter API failed";

        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoadingFilters(false);
        }
      }
    };

    fetchFilterData();

    return () => {
      isMounted = false;
    };
  }, [filters.tenantId, refreshKey]);

  useEffect(() => {
    let isMounted = true;

    const fetchTableBots = async () => {
      try {
        const response = await getBots({
          date: FIXED_DASHBOARD_DATE,
          fromDate: FIXED_DASHBOARD_DATE,
          toDate: FIXED_DASHBOARD_DATE,
          tenantId: filters.tenantId || undefined,
          healthStatus: filters.status || undefined,
          useCase: filters.useCase || undefined,
          search: tableSearch || undefined,
          page: tablePage,
          limit: tableLimit,
        });

        if (!isMounted) return;

        if (response?.status !== 1) {
          throw new Error(response?.message || "Failed to load bot table");
        }

        setTableBots(safeArray(response?.data?.bots));
        setTablePagination(
          response?.data?.pagination || {
            ...defaultPagination,
            limit: tableLimit,
          },
        );
      } catch (err) {
        if (!isMounted) return;

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Bot table API failed";

        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoadingTable(false);
        }
      }
    };

    fetchTableBots();

    return () => {
      isMounted = false;
    };
  }, [
    filters.tenantId,
    filters.status,
    filters.useCase,
    tableSearch,
    tablePage,
    tableLimit,
    refreshKey,
  ]);

  const handleFilterChange = (key, value) => {
    setIsLoadingDashboard(true);
    setIsLoadingTable(true);
    setTablePage(1);

    if (key === "tenantId") {
      setIsLoadingFilters(true);
    }

    setFilters((current) => {
      const nextFilters = {
        ...current,
        [key]: value,
      };

      if (key === "tenantId") {
        nextFilters.botId = "";
      }

      return nextFilters;
    });
  };

  const handleRefresh = () => {
    setIsLoadingDashboard(true);
    setIsLoadingFilters(true);
    setIsLoadingTable(true);
    setRefreshKey((current) => current + 1);
  };

  const handleTableSearchChange = (value) => {
    setTableSearch(value);
    setTablePage(1);
    setIsLoadingTable(true);
  };

  const handleHealthFilterChange = (value) => {
    setTableHealthFilter(value);
    setTablePage(1);
  };

  const handlePageSizeChange = (value) => {
    setTableLimit(value);
    setTablePage(1);
    setIsLoadingTable(true);
  };

  const handleTablePageChange = (page) => {
    setTablePage(page);
    setIsLoadingTable(true);
  };

  const handleViewBot = (bot) => {
    toast.info(`${bot.tenantName || "Tenant"} / ${bot.botName || "Bot"}`);
  };

  const summary = dashboardData?.summary || {};
  const aiInsights = safeArray(dashboardData?.aiInsights);
  const dashboardBotList = safeArray(dashboardData?.botList);
  const healthDistribution = safeArray(dashboardData?.healthDistribution);
  const fallbackTrend = safeArray(dashboardData?.fallbackTrend);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <PageHeader
        theme={theme}
        onToggleTheme={onToggleTheme}
        onRefresh={handleRefresh}
        isRefreshing={isLoadingDashboard}
      />

      <FilterBar
        filters={filters}
        tenants={tenants}
        bots={bots}
        isLoading={isLoadingFilters}
        onChange={handleFilterChange}
      />

      <div className="px-[17px] py-[24px]">
        {error ? (
          <Card className="mb-4 border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              {error}
            </p>
          </Card>
        ) : null}

        {isLoadingDashboard ? (
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[147px] animate-pulse rounded-[14px] border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            <SummaryCards summary={summary} botList={dashboardBotList} />

            <InsightCard insights={aiInsights} />

            <BotListTable
              bots={tableBots}
              pagination={tablePagination}
              search={tableSearch}
              healthFilter={tableHealthFilter}
              sortBy={tableSortBy}
              sortOrder={tableSortOrder}
              pageSize={tableLimit}
              isLoading={isLoadingTable}
              onSearchChange={handleTableSearchChange}
              onHealthFilterChange={handleHealthFilterChange}
              onSortByChange={handleSortByChange}
              onSortOrderChange={handleSortOrderChange}
              onPageSizeChange={handlePageSizeChange}
              onPageChange={handleTablePageChange}
              onView={handleViewBot}
            />

            <HealthDistribution
              healthDistribution={healthDistribution}
              fallbackTrend={fallbackTrend}
            />
            <AdminChatbot
              tenants={tenants}
              bots={bots}
              selectedTenantId={filters.tenantId}
              selectedBotId={filters.botId}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
