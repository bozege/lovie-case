import type { RequestStatus } from "../../lib/types";

type DashboardFiltersProps = {
  includeSelfRequests: boolean;
  search: string;
  selectedStatus: "all" | RequestStatus;
  onIncludeSelfRequestsChange: (value: boolean) => void;
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
  includeSelfRequests,
  search,
  selectedStatus,
  onIncludeSelfRequestsChange,
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

      <label className="checkbox-field">
        <input
          checked={includeSelfRequests}
          onChange={(event) => onIncludeSelfRequestsChange(event.target.checked)}
          type="checkbox"
        />
        <span>Include self-sent requests in incoming list</span>
      </label>
    </div>
  );
}
