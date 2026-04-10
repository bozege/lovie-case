import { supabase } from "../../lib/supabase/client";
import { parseAmountToMinorUnits } from "../../lib/money/amount";
import { requestSchema } from "../../lib/validation/request";

type CreateRequestInput = {
  senderEmail: string;
  senderUserId: string;
  recipientContact: string;
  amount: string;
  note: string;
};

function buildShareToken() {
  return crypto.randomUUID().replaceAll("-", "");
}

function getExpiresAt() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt.toISOString();
}

export async function createPaymentRequest(input: CreateRequestInput) {
  const parsed = requestSchema.safeParse({
    recipientContact: input.recipientContact,
    amount: input.amount,
    note: input.note || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid request data");
  }

  const amountMinor = parseAmountToMinorUnits(input.amount);

  if (amountMinor === null) {
    throw new Error("Amount must be greater than zero");
  }

  const shareToken = buildShareToken();

  const { data, error } = await supabase
    .from("payment_requests")
    .insert({
      sender_user_id: input.senderUserId,
      sender_email: input.senderEmail,
      recipient_contact: parsed.data.recipientContact,
      recipient_user_id: null,
      amount_minor: amountMinor,
      currency: "USD",
      note: parsed.data.note?.trim() || null,
      status: "pending",
      share_token: shareToken,
      expires_at: getExpiresAt(),
    })
    .select("id, share_token")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id as string,
    shareToken: data.share_token as string,
    amountMinor,
  };
}
