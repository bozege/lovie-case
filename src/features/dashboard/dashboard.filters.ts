import type { PaymentRequest, RequestStatus } from "../../lib/types";

type FilterOptions = {
  search: string;
  selectedStatus: "all" | RequestStatus;
  role: "incoming" | "outgoing";
};

export function filterRequests(
  requests: PaymentRequest[],
  options: FilterOptions
) {
  const normalizedSearch = options.search.trim().toLowerCase();

  return requests.filter((request) => {
    const roleField =
      options.role === "outgoing" ? request.recipientContact : request.senderEmail;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      roleField.toLowerCase().includes(normalizedSearch) ||
      (request.note ?? "").toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      options.selectedStatus === "all" || request.status === options.selectedStatus;

    return matchesSearch && matchesStatus;
  });
}
