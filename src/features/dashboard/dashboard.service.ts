import { supabase } from "../../lib/supabase/client";
import { isE2eMode, readE2eRequests, writeE2eRequests } from "../../lib/e2e-mode";
import { getEffectiveStatus, isExpired } from "../../lib/request-status";
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

export function mapRequest(row: PaymentRequestRow): PaymentRequest {
  const status = getEffectiveStatus(row.status, row.expires_at);

  return {
    id: row.id,
    senderUserId: row.sender_user_id,
    senderEmail: row.sender_email,
    recipientContact: row.recipient_contact,
    recipientUserId: row.recipient_user_id,
    amountMinor: row.amount_minor,
    currency: row.currency,
    note: row.note,
    status,
    shareToken: row.share_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
    declinedAt: row.declined_at,
    canceledAt: row.canceled_at,
  };
}

async function reconcileExpiredRequests(rows: PaymentRequestRow[]) {
  const expiredPendingIds = rows
    .filter((row) => row.status === "pending" && isExpired(row.expires_at))
    .map((row) => row.id);

  if (expiredPendingIds.length === 0) {
    return;
  }

  await supabase
    .from("payment_requests")
    .update({ status: "expired" })
    .in("id", expiredPendingIds);
}

export async function listOutgoingRequests(senderEmail: string) {
  if (isE2eMode) {
    const requests = readE2eRequests();
    writeE2eRequests(requests);
    return requests
      .filter((request) => request.senderEmail === senderEmail)
      .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
  }

  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("sender_email", senderEmail)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as PaymentRequestRow[];
  await reconcileExpiredRequests(rows);
  return rows.map(mapRequest);
}

export async function listIncomingRequests(email: string, userId: string) {
  if (isE2eMode) {
    const requests = readE2eRequests();
    writeE2eRequests(requests);
    return requests
      .filter(
        (request) =>
          request.recipientContact === email || request.recipientUserId === userId
      )
      .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
  }

  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .or(`recipient_contact.eq.${email},recipient_user_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as PaymentRequestRow[];
  await reconcileExpiredRequests(rows);
  return rows.map(mapRequest);
}

export async function getRequestByShareToken(shareToken: string) {
  if (isE2eMode) {
    const requests = readE2eRequests();
    writeE2eRequests(requests);
    const request = requests.find((item) => item.shareToken === shareToken);

    if (!request) {
      throw new Error("Request not found");
    }

    return request;
  }

  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("share_token", shareToken)
    .single();

  if (error) {
    throw error;
  }

  const row = data as PaymentRequestRow;
  await reconcileExpiredRequests([row]);
  return mapRequest(row);
}
