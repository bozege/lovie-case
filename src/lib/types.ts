export type RequestStatus =
  | "pending"
  | "paid"
  | "declined"
  | "canceled"
  | "expired";

export type PaymentRequest = {
  id: string;
  senderUserId: string;
  senderEmail: string;
  recipientContact: string;
  recipientUserId: string | null;
  amountMinor: number;
  currency: "USD";
  note: string | null;
  status: RequestStatus;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  paidAt: string | null;
  declinedAt: string | null;
  canceledAt: string | null;
};

export type AuthState = {
  email: string | null;
  isAuthenticated: boolean;
};
