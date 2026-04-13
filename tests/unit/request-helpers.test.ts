import { describe, expect, it } from "vitest";
import { filterRequests } from "../../src/features/dashboard/dashboard.filters";
import { parseAmountToMinorUnits } from "../../src/lib/money/amount";
import { canCancel, canResolve, getEffectiveStatus } from "../../src/lib/request-status";
import type { PaymentRequest } from "../../src/lib/types";
import { requestSchema } from "../../src/lib/validation/request";

const futureDate = "2099-01-01T00:00:00.000Z";
const pastDate = "2020-01-01T00:00:00.000Z";

function buildRequest(overrides: Partial<PaymentRequest> = {}): PaymentRequest {
  return {
    id: "request-1",
    senderUserId: "sender-1",
    senderEmail: "sender@example.com",
    recipientContact: "recipient@example.com",
    recipientUserId: null,
    amountMinor: 2500,
    currency: "USD",
    note: "Dinner split",
    status: "pending",
    shareToken: "requesttoken",
    createdAt: "2026-04-10T12:00:00.000Z",
    updatedAt: "2026-04-10T12:00:00.000Z",
    expiresAt: futureDate,
    paidAt: null,
    declinedAt: null,
    canceledAt: null,
    ...overrides,
  };
}

describe("request helper coverage", () => {
  it("parses valid USD amounts into minor units", () => {
    expect(parseAmountToMinorUnits("24.50")).toBe(2450);
    expect(parseAmountToMinorUnits("0")).toBeNull();
    expect(parseAmountToMinorUnits("not money")).toBeNull();
  });

  it("validates contact, amount, and note constraints", () => {
    expect(
      requestSchema.safeParse({
        recipientContact: "friend@example.com",
        amount: "12.00",
        note: "Lunch",
      }).success
    ).toBe(true);

    expect(
      requestSchema.safeParse({
        recipientContact: "not-a-contact",
        amount: "12.00",
      }).success
    ).toBe(false);
  });

  it("blocks expired pending requests from terminal actions", () => {
    expect(getEffectiveStatus("pending", pastDate)).toBe("expired");
    expect(canResolve("pending", pastDate)).toBe(false);
    expect(canCancel("pending", pastDate)).toBe(false);
    expect(canResolve("pending", futureDate)).toBe(true);
  });

  it("filters requests by role text and selected status", () => {
    const requests = [
      buildRequest({ recipientContact: "alex@example.com", note: "Coffee" }),
      buildRequest({
        id: "request-2",
        senderEmail: "maya@example.com",
        status: "paid",
        note: "Train tickets",
      }),
    ];

    expect(
      filterRequests(requests, {
        role: "outgoing",
        search: "alex",
        selectedStatus: "all",
      })
    ).toHaveLength(1);

    expect(
      filterRequests(requests, {
        role: "incoming",
        search: "maya",
        selectedStatus: "paid",
      })
    ).toHaveLength(1);
  });
});
