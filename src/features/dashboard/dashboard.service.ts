import { supabase } from "../../lib/supabase/client";
import type { PaymentRequest, RequestStatus } from "../../lib/types";

type PaymentRequestRow = {
  id: string;
  sender_user_id: string;
  sender_email: string;
  recipient_contact: string;
  recipient_user_id: string | null;
  amount_minor: number;
  currency: "USD";
  note: string | null;
  status: RequestStatus;
  share_token: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  paid_at: string | null;
  declined_at: string | null;
  canceled_at: string | null;
};

function mapRequest(row: PaymentRequestRow): PaymentRequest {
  return {
    id: row.id,
    senderUserId: row.sender_user_id,
    senderEmail: row.sender_email,
    recipientContact: row.recipient_contact,
    recipientUserId: row.recipient_user_id,
    amountMinor: row.amount_minor,
    currency: row.currency,
    note: row.note,
    status: row.status,
    shareToken: row.share_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
    declinedAt: row.declined_at,
    canceledAt: row.canceled_at,
  };
}

export async function listOutgoingRequests(senderEmail: string) {
  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("sender_email", senderEmail)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PaymentRequestRow[]).map(mapRequest);
}
