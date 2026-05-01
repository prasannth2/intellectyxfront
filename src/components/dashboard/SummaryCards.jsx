import {
  AlertTriangle,
  Bot,
  Building2,
  Clock,
  MessageSquare,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { formatNumber, formatPercent } from "../../utils/formatters";
import { getHealthStatusFromScore } from "../../utils/statusStyles";

const cardConfig = [
  {
    key: "totalTenants",
    label: "Total Tenants",
    icon: Building2,
    popupTitle: "Tenants",
  },
  {
    key: "totalBots",
    label: "Total Bots",
    icon: Bot,
    popupTitle: "All Bots",
  },
  {
    key: "botsNeedingAttention",
    label: "Bots Needing Attention",
    icon: AlertTriangle,
    popupTitle: "Bots Needing Attention",
  },
  {
    key: "criticalBots",
    label: "Critical Bots",
    icon: Clock,
    popupTitle: "Critical Bots",
  },
  {
    key: "totalConversations",
    label: "Total Conversations Today",
    icon: MessageSquare,
    popupTitle: "Top Usage Bots",
  },
  {
    key: "avgSuccessRate",
    label: "Average Success Rate",
    icon: TrendingUp,
    popupTitle: "Bot Success Rates",
  },
];

function getCardValue(summary, key) {
  if (key === "botsNeedingAttention") {
    return (summary?.criticalBots || 0) + (summary?.warningBots || 0);
  }

  if (key === "avgSuccessRate") {
    return formatPercent(summary?.avgSuccessRate || 0);
  }

  return formatNumber(summary?.[key] || 0);
}

function getBotHealthStatus(bot) {
  return bot?.healthStatus || getHealthStatusFromScore(bot?.healthScore || 0);
}

function getPopupItems(cardKey, botList = []) {
  const bots = Array.isArray(botList) ? botList : [];

  if (cardKey === "totalTenants") {
    const uniqueTenants = [];

    bots.forEach((bot) => {
      const tenantId = bot.tenantId || bot.tenantName;

      if (!tenantId) return;

      const exists = uniqueTenants.some((item) => item.id === tenantId);

      if (!exists) {
        uniqueTenants.push({
          id: tenantId,
          title: bot.tenantName || "Unknown Tenant",
          subtitle: bot.tenantCode || "Client",
        });
      }
    });

    return uniqueTenants.slice(0, 8);
  }

  if (cardKey === "criticalBots") {
    return bots
      .filter((bot) => getBotHealthStatus(bot) === "critical")
      .slice(0, 8)
      .map((bot) => ({
        id: bot._id,
        title: bot.botName || "Unnamed Bot",
        subtitle: bot.tenantName || "Unknown Tenant",
        value: `${bot.healthScore || 0}`,
      }));
  }

  if (cardKey === "botsNeedingAttention") {
    return bots
      .filter((bot) => {
        const status = getBotHealthStatus(bot);
        return status === "critical" || status === "warning";
      })
      .slice(0, 8)
      .map((bot) => ({
        id: bot._id,
        title: bot.botName || "Unnamed Bot",
        subtitle: `${bot.tenantName || "Unknown Tenant"} · ${getBotHealthStatus(
          bot,
        )}`,
        value: `${bot.healthScore || 0}`,
      }));
  }

  if (cardKey === "totalConversations") {
    return [...bots]
      .sort(
        (a, b) => Number(b.conversations || 0) - Number(a.conversations || 0),
      )
      .slice(0, 8)
      .map((bot) => ({
        id: bot._id,
        title: bot.botName || "Unnamed Bot",
        subtitle: bot.tenantName || "Unknown Tenant",
        value: formatNumber(bot.conversations || 0),
      }));
  }

  if (cardKey === "avgSuccessRate") {
    return [...bots]
      .sort((a, b) => Number(b.successRate || 0) - Number(a.successRate || 0))
      .slice(0, 8)
      .map((bot) => ({
        id: bot._id,
        title: bot.botName || "Unnamed Bot",
        subtitle: bot.tenantName || "Unknown Tenant",
        value: formatPercent(bot.successRate || 0),
      }));
  }

  return bots.slice(0, 8).map((bot) => ({
    id: bot._id,
    title: bot.botName || "Unnamed Bot",
    subtitle: bot.tenantName || "Unknown Tenant",
    value: bot.healthScore ? `${bot.healthScore}` : "",
  }));
}

function SummaryPopup({ title, items, onClose }) {
  return (
    <div className="absolute left-[21px] top-[66px] z-30 w-[280px] rounded-[12px] border border-slate-200 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.16)] dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold text-slate-950 dark:text-white">
          {title}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X size={14} />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-[9px] bg-slate-50 px-3 py-2 text-[12px] text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          No matching data found.
        </p>
      ) : (
        <div className="max-h-[240px] overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id || item.title}
              className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>

                <p className="mt-0.5 truncate text-[12px] text-slate-500 dark:text-slate-400">
                  {item.subtitle}
                </p>
              </div>

              {item.value ? (
                <span className="shrink-0 text-[12px] font-bold text-blue-600 dark:text-blue-400">
                  {item.value}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCards({ summary, botList = [] }) {
  const [activePopup, setActivePopup] = useState("");

  const popupData = useMemo(() => {
    if (!activePopup) {
      return {
        title: "",
        items: [],
      };
    }

    const config = cardConfig.find((card) => card.key === activePopup);

    return {
      title: config?.popupTitle || "Details",
      items: getPopupItems(activePopup, botList),
    };
  }, [activePopup, botList]);

  const handleIconClick = (cardKey) => {
    setActivePopup((current) => (current === cardKey ? "" : cardKey));
  };

  return (
    <section className="grid grid-cols-1 gap-[16px] md:grid-cols-4">
      {cardConfig.map((card) => {
        const Icon = card.icon;
        const isOpen = activePopup === card.key;

        return (
          <div
            key={card.key}
            className="relative h-[147px] rounded-[14px] border border-slate-200 bg-white px-[21px] py-[21px] shadow-[0_1px_3px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => handleIconClick(card.key)}
              className="flex h-[37px] w-[37px] items-center justify-center rounded-[10px] bg-blue-50 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-950"
              title={`View ${card.popupTitle}`}
            >
              <Icon size={22} strokeWidth={2} />
            </button>

            <div className="mt-[18px]">
              <p className="text-[24px] font-extrabold leading-none tracking-[-0.02em] text-slate-950 dark:text-white">
                {getCardValue(summary, card.key)}
              </p>

              <p className="mt-[8px] text-[14px] leading-none text-slate-700 dark:text-slate-300">
                {card.label}
              </p>
            </div>

            {isOpen ? (
              <SummaryPopup
                title={popupData.title}
                items={popupData.items}
                onClose={() => setActivePopup("")}
              />
            ) : null}
          </div>
        );
      })}
    </section>
  );
}

export default SummaryCards;
