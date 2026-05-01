import { SendHorizonal } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { sendAiAssistantMessage } from "../../services/api";
import { formatNumber, formatPercent } from "../../utils/formatters";
import Input from "../ui/Input";
import Select from "../ui/Select";

const defaultQuickActions = [
  "Which bots are critical?",
  "Which tenant needs attention?",
  "Why is this bot critical?",
  "What changed today?",
  "What should I fix first?",
  "Show failed topics",
  "Compare with yesterday",
];

function SummaryBlock({ block }) {
  const data = block?.data || {};

  return (
    <div className="mt-3 rounded-[10px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-[14px] font-bold text-slate-950 dark:text-white">
          {block?.title || "Summary"}
        </h4>

        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold capitalize text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {data.healthStatus || block?.statusType || "healthy"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-3">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Tenant</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {data.tenantName || "-"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Bot</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {data.botName || "-"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Use Case</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {data.useCase || "-"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Health Score</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {data.healthScore || 0}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Conversations</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(data.conversations || 0)}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Active Users</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(data.activeUsers || 0)}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Success</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {formatPercent(data.successRate || 0)}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Fallback</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {formatPercent(data.fallbackRate || 0)}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Failure</p>
          <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
            {formatPercent(data.failureRate || 0)}
          </p>
        </div>
      </div>

      {data.recommendedAction ? (
        <div className="mt-4 rounded-[9px] bg-blue-50 p-3 text-[12px] leading-[18px] text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <span className="font-bold">Recommended action:</span>{" "}
          {data.recommendedAction}
        </div>
      ) : null}
    </div>
  );
}

function ChartBlock({ block }) {
  const data = Array.isArray(block?.data) ? block.data : [];
  const xKey = block?.xKey || "metric";
  const yKey = block?.yKeys?.[0] || "value";

  if (!data.length) return null;

  return (
    <div className="mt-3 rounded-[10px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <h4 className="mb-3 text-[14px] font-bold text-slate-950 dark:text-white">
        {block?.title || "Chart"}
      </h4>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey={yKey} fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TableBlock({ block }) {
  const columns = Array.isArray(block?.columns) ? block.columns : [];
  const rows = Array.isArray(block?.rows) ? block.rows : [];

  if (!columns.length || !rows.length) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-[10px] border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
      <h4 className="border-b border-slate-200 px-3 py-2 text-[14px] font-bold text-slate-950 dark:border-slate-700 dark:text-white">
        {block?.title || "Table"}
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-[12px]">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-2 font-bold text-slate-700 dark:text-slate-300"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-t border-slate-200 dark:border-slate-800"
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className="px-3 py-2 text-slate-700 dark:text-slate-300"
                  >
                    {row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListBlock({ block }) {
  const items = Array.isArray(block?.items) ? block.items : [];

  if (!items.length) return null;

  return (
    <div className="mt-3 rounded-[10px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      <h4 className="mb-3 text-[14px] font-bold text-slate-950 dark:text-white">
        {block?.title || "Recommended Fixes"}
      </h4>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={`list-item-${index}`}>
            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
              {item.title}
            </p>

            <p className="mt-1 text-[12px] leading-[18px] text-slate-600 dark:text-slate-400">
              {item.description}
            </p>

            <p className="mt-1 text-[12px] font-medium text-blue-700 dark:text-blue-300">
              {item.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssistantBlocks({ blocks = [] }) {
  const richBlocks = blocks.filter((block) => block.type !== "text");

  if (!richBlocks.length) return null;

  return (
    <div className="mt-3">
      {richBlocks.map((block, index) => {
        const blockKey = block.id || `block-${index}`;

        if (block.type === "summary_card") {
          return <SummaryBlock key={blockKey} block={block} />;
        }

        if (block.type === "chart") {
          return <ChartBlock key={blockKey} block={block} />;
        }

        if (block.type === "table") {
          return <TableBlock key={blockKey} block={block} />;
        }

        if (block.type === "list") {
          return <ListBlock key={blockKey} block={block} />;
        }

        return null;
      })}
    </div>
  );
}

function AdminChatbot({
  tenants = [],
  bots = [],
  selectedTenantId = "",
  selectedBotId = "",
}) {
  const [tenantId, setTenantId] = useState(selectedTenantId || "");
  const [botId, setBotId] = useState(selectedBotId || "");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState(defaultQuickActions);
  const [messages, setMessages] = useState([]);

  const chatBodyRef = useRef(null);
  const messageIdRef = useRef(1);

  const getMessageId = (prefix) => {
    messageIdRef.current += 1;
    return `${prefix}-${messageIdRef.current}`;
  };

  const filteredBots = useMemo(() => {
    if (!tenantId) return bots;

    return bots.filter(
      (bot) => String(bot.tenantId || "") === String(tenantId),
    );
  }, [bots, tenantId]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    });
  };

  const sendMessage = async (messageText) => {
    const finalMessage = String(messageText || input).trim();

    if (!finalMessage || isSending) return;

    const userMessage = {
      id: getMessageId("user"),
      role: "user",
      content: finalMessage,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);
    scrollToBottom();

    try {
      const response = await sendAiAssistantMessage({
        tenantId: tenantId || "",
        botId: botId || "",
        message: finalMessage,
      });

      if (response?.status !== 1) {
        throw new Error(response?.message || "AI assistant failed");
      }

      const data = response?.data || {};

      const assistantMessage = {
        id: getMessageId("assistant"),
        role: "assistant",
        content: data.answer || "No response generated.",
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        contextSummary: data.contextSummary || null,
      };

      setMessages((current) => [...current, assistantMessage]);

      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }

      scrollToBottom();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "AI assistant request failed";

      toast.error(message);

      setMessages((current) => [
        ...current,
        {
          id: getMessageId("assistant-error"),
          role: "assistant",
          content: message,
          blocks: [],
        },
      ]);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const handleTenantChange = (value) => {
    setTenantId(value);
    setBotId("");
  };

  return (
    <section className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-900">
      <div className="px-[24px] py-[28px]">
        <h2 className="text-[18px] font-extrabold leading-none text-slate-950 dark:text-white">
          Ask AI Ops Assistant
        </h2>

        <div className="mt-[21px] grid grid-cols-1 gap-[12px] md:grid-cols-2">
          <Select
            value={tenantId}
            onChange={(event) => handleTenantChange(event.target.value)}
            className="h-[39px] w-full"
          >
            <option value="">All Tenants</option>
            {tenants.map((tenant) => (
              <option key={tenant._id} value={tenant._id}>
                {tenant.name}
              </option>
            ))}
          </Select>

          <Select
            value={botId}
            onChange={(event) => setBotId(event.target.value)}
            className="h-[39px] w-full"
          >
            <option value="">All Bots</option>
            {filteredBots.map((bot) => (
              <option key={bot._id} value={bot._id}>
                {bot.botName || bot.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div
        ref={chatBodyRef}
        className="min-h-[400px] max-h-[520px] overflow-y-auto border-t border-slate-200 px-[24px] py-[24px] dark:border-slate-800"
      >
        <div className="flex flex-col gap-[16px]">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    isUser
                      ? "max-w-[342px] rounded-[9px] bg-blue-600 px-[16px] py-[13px] text-[14px] leading-[20px] text-white shadow-sm"
                      : "max-w-[646px] rounded-[9px] border border-slate-200 bg-slate-100 px-[16px] py-[13px] text-[14px] leading-[20px] text-slate-950 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  }
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {!isUser ? (
                    <AssistantBlocks blocks={message.blocks || []} />
                  ) : null}
                </div>
              </div>
            );
          })}

          {isSending ? (
            <div className="flex justify-start">
              <div className="rounded-[9px] border border-slate-200 bg-slate-100 px-[16px] py-[13px] text-[14px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Thinking...
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-200 px-[17px] py-[15px] dark:border-slate-800">
        <div className="mb-[12px] flex flex-wrap items-center gap-[8px]">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isSending}
              onClick={() => sendMessage(suggestion)}
              className="h-[24px] rounded-full bg-slate-100 px-[12px] text-[12px] font-medium text-slate-900 transition hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-[8px]"
        >
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask: Which bots need attention today?"
            className="h-[38px] flex-1 rounded-[9px] text-[14px]"
          />

          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="flex h-[38px] w-[48px] shrink-0 items-center justify-center rounded-[9px] bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <SendHorizonal size={19} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminChatbot;
