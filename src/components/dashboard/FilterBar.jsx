import Select from "../ui/Select";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Critical", value: "critical" },
  { label: "Warning", value: "warning" },
  { label: "Healthy", value: "healthy" },
];

const useCaseOptions = [
  { label: "All Use Cases", value: "" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Onboarding", value: "Onboarding" },
  { label: "HR", value: "HR" },
  { label: "Sales", value: "Sales" },
  { label: "Internal Tools", value: "Internal Tools" },
];

function FilterBar({ filters, tenants, onChange }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-[17px] py-[16px] dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.tenantId}
          onChange={(event) => onChange("tenantId", event.target.value)}
          className="h-[49px] w-[151px] text-[20px]"
        >
          <option value="">All Tenants</option>
          {tenants.map((tenant) => (
            <option key={tenant._id} value={tenant._id}>
              {tenant.name}
            </option>
          ))}
        </Select>

        {/* <Select
          value={filters.botId}
          onChange={(event) => onChange("botId", event.target.value)}
          className="h-[49px] w-[128px] text-[20px]"
        >
          <option value="">All Bots</option>
          {bots.map((bot) => (
            <option key={bot._id} value={bot._id}>
              {bot.botName || bot.name}
            </option>
          ))}
        </Select> */}

        <Select
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
          className="h-[49px] w-[139px] text-[20px]"
        >
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.useCase}
          onChange={(event) => onChange("useCase", event.target.value)}
          className="h-[49px] w-[211px] text-[20px]"
        >
          {useCaseOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </section>
  );
}

export default FilterBar;
