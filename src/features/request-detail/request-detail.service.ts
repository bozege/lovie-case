import { supabase } from "../../lib/supabase/client";
import { isE2eMode, updateE2eRequest } from "../../lib/e2e-mode";
import { canCancel, canResolve } from "../../lib/request-status";
import type { PaymentRequest } from "../../lib/types";

type MutateInput = {
  request: PaymentRequest;
  actorEmail: string;
};

async function updateStatus(
  requestId: string,
  nextStatus: "paid" | "declined" | "canceled" | "expired"
) {
  const timestamp = new Date().toISOString();
  const updates: Record<string, string> = {
    status: nextStatus,
    updated_at: timestamp,
  };

  if (nextStatus === "paid") {
    updates.paid_at = timestamp;
  }

  if (nextStatus === "declined") {
    updates.declined_at = timestamp;
  }

  if (nextStatus === "canceled") {
    updates.canceled_at = timestamp;
  }

  if (isE2eMode) {
    updateE2eRequest(requestId, {
      status: nextStatus,
      updatedAt: timestamp,
      paidAt: nextStatus === "paid" ? timestamp : null,
      declinedAt: nextStatus === "declined" ? timestamp : null,
      canceledAt: nextStatus === "canceled" ? timestamp : null,
    });
    return;
  }

  const { error } = await supabase
    .from("payment_requests")
    .update(updates)
    .eq("id", requestId);

  if (error) {
    throw error;
  }
}

export function isSender(request: PaymentRequest, actorEmail: string) {
  return request.senderEmail === actorEmail;
}

export function isRecipient(request: PaymentRequest, actorEmail: string) {
  return request.recipientContact === actorEmail;
}

export async function payRequest({ request, actorEmail }: MutateInput) {
  if (!isRecipient(request, actorEmail) || !canResolve(request.status, request.expiresAt)) {
    throw new Error("You cannot pay this request");
  }

  await updateStatus(request.id, "paid");
}

export async function declineRequest({ request, actorEmail }: MutateInput) {
  if (!isRecipient(request, actorEmail) || !canResolve(request.status, request.expiresAt)) {
    throw new Error("You cannot decline this request");
  }

  await updateStatus(request.id, "declined");
}

export async function cancelRequest({ request, actorEmail }: MutateInput) {
  if (!isSender(request, actorEmail) || !canCancel(request.status, request.expiresAt)) {
    throw new Error("You cannot cancel this request");
  }

  await updateStatus(request.id, "canceled");
}
