import { Sparkles } from "lucide-react";

function insightToText(insight) {
  if (typeof insight === "string") {
    return insight;
  }

  if (!insight || typeof insight !== "object") {
    return "";
  }

  const title = insight.title || "";
  const reason = insight.reason || "";
  const recommendedAction = insight.recommendedAction || "";

  return `${title}. ${reason}. Recommended action: ${recommendedAction}`;
}

function getInsightMeta(insight = {}) {
  const severity =
    typeof insight === "object" && insight !== null
      ? String(insight.severity || "").toLowerCase()
      : "";

  const message = insightToText(insight);
  const lower = String(message || "").toLowerCase();

  if (
    severity === "critical" ||
    lower.includes("critical") ||
    lower.includes("failure") ||
    lower.includes("drop-off") ||
    lower.includes("dropoff")
  ) {
    return {
      priority: "Critical",
      badgeClass: "bg-red-500 text-white",
    };
  }

  if (
    severity === "warning" ||
    lower.includes("warning") ||
    lower.includes("fallback") ||
    lower.includes("attention") ||
    lower.includes("low usage")
  ) {
    return {
      priority: "Warning",
      badgeClass: "bg-amber-500 text-white",
    };
  }

  return {
    priority: "Info",
    badgeClass: "bg-blue-500 text-white",
  };
}

function splitInsight(insight = "") {
  if (typeof insight === "object" && insight !== null) {
    const tenantName = insight.tenantName || "";
    const botName = insight.botName || "";
    const title = insight.title || "";
    const reason = insight.reason || "";
    const action =
      insight.recommendedAction || "Continue monitoring performance.";

    const botLabel =
      tenantName && botName
        ? `${tenantName} / ${botName}`
        : tenantName || botName || "";

    return {
      mainMessage: botLabel ? `${botLabel} ${title}` : title || reason,
      action,
      reason,
      metrics: insight.metrics || null,
    };
  }

  const message = String(insight || "");
  const recommendedText = "Recommended action:";

  if (message.includes(recommendedText)) {
    const [mainMessage, action] = message.split(recommendedText);

    return {
      mainMessage: mainMessage.trim(),
      action: action.trim(),
      reason: "",
      metrics: null,
    };
  }

  const sentenceParts = message.split(".");

  if (sentenceParts.length > 1) {
    return {
      mainMessage: `${sentenceParts[0].trim()}.`,
      action: sentenceParts.slice(1).join(".").trim(),
      reason: "",
      metrics: null,
    };
  }

  return {
    mainMessage: message,
    action: "Continue monitoring performance.",
    reason: "",
    metrics: null,
  };
}

function getInsightKey(insight, index) {
  if (typeof insight === "object" && insight !== null) {
    return (
      insight.id ||
      insight.botId ||
      `${insight.tenantName}-${insight.botName}-${index}`
    );
  }

  return `${String(insight)}-${index}`;
}

function InsightCard({ insights = [] }) {
  const safeInsights = Array.isArray(insights) ? insights : [];

  const displayInsights =
    safeInsights.length > 0
      ? safeInsights
      : [
          {
            severity: "info",
            title: "All monitored bots are currently stable",
            reason: "No critical or warning insights were found.",
            recommendedAction: "Continue monitoring performance.",
          },
        ];

  return (
    <section className="rounded-[14px] border border-purple-200 bg-purple-50/40 px-[24px] py-[26px] shadow-[0_1px_3px_rgba(126,34,206,0.16)] dark:border-purple-900 dark:bg-purple-950/20">
      <div className="mb-[17px] flex items-center gap-2">
        <Sparkles
          size={25}
          strokeWidth={2.4}
          className="text-purple-600 dark:text-purple-400"
        />

        <h2 className="text-[21px] font-extrabold leading-none tracking-[-0.01em] text-slate-950 dark:text-white">
          AI Insights & Recommended Actions
        </h2>
      </div>

      <div className="flex flex-col gap-[13px]">
        {displayInsights.map((insight, index) => {
          const meta = getInsightMeta(insight, index);
          const content = splitInsight(insight);

          const words = String(content.mainMessage || "").split(" ");
          const boldText = words.slice(0, 4).join(" ");
          const normalText =
            words.length > 4 ? ` ${words.slice(4).join(" ")}` : "";

          return (
            <div
              key={getInsightKey(insight, index)}
              className="rounded-[9px] border border-slate-200 bg-white px-[16px] py-[16px] shadow-[0_1px_1px_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-[12px]">
                <span
                  className={`mt-[1px] inline-flex h-[24px] min-w-[54px] items-center justify-center rounded-[4px] px-[8px] text-[12px] font-bold leading-none ${meta.badgeClass}`}
                >
                  {meta.priority}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-[20px] text-slate-950 dark:text-slate-100">
                    <span className="font-bold">{boldText}</span>
                    {normalText}
                  </p>

                  {content.reason ? (
                    <p className="mt-[4px] text-[13px] leading-[18px] text-slate-700 dark:text-slate-300">
                      <span className="font-medium">Reason:</span>{" "}
                      {content.reason}
                    </p>
                  ) : null}

                  <p className="mt-[4px] text-[13px] leading-[18px] text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Recommended action:</span>{" "}
                    {content.action || "Continue monitoring performance."}
                  </p>

                  {content.metrics ? (
                    <div className="mt-[8px] flex flex-wrap gap-2 text-[12px] text-slate-600 dark:text-slate-400">
                      <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                        Score: {content.metrics.healthScore}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                        Success: {content.metrics.successRate}%
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                        Fallback: {content.metrics.fallbackRate}%
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                        Failure: {content.metrics.failureRate}%
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                        Drop-off: {content.metrics.dropOffRate}%
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default InsightCard;
