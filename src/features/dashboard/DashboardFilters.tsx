import type { RequestStatus } from "../../lib/types";

type DashboardFiltersProps = {
  search: string;
  selectedStatus: "all" | RequestStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | RequestStatus) => void;
};

const statusOptions: Array<"all" | RequestStatus> = [
  "all",
  "pending",
  "paid",
  "declined",
  "canceled",
  "expired",
];

export function DashboardFilters({
  search,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: DashboardFiltersProps) {
  return (
    <div className="dashboard-filters">
      <label className="field">
        <span>Search</span>
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by sender or recipient"
          value={search}
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select
          onChange={(event) =>
            onStatusChange(event.target.value as "all" | RequestStatus)
          }
          value={selectedStatus}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === "all" ? "All statuses" : status}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
