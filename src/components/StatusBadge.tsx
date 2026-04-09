import type { RequestStatus } from "../lib/types";

type StatusBadgeProps = {
  status: RequestStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>;
}
