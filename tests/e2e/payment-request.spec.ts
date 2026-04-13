import { expect, test, type Page } from "@playwright/test";

const session = {
  userId: "e2e-bozege16",
  email: "bozege16@gmail.com",
};

type SeedRequest = {
  id: string;
  senderUserId: string;
  senderEmail: string;
  recipientContact: string;
  recipientUserId: string | null;
  amountMinor: number;
  currency: "USD";
  note: string | null;
  status: "pending" | "paid" | "declined" | "canceled" | "expired";
  shareToken: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  paidAt: string | null;
  declinedAt: string | null;
  canceledAt: string | null;
};

const futureDate = "2099-01-01T00:00:00.000Z";
const pastDate = "2020-01-01T00:00:00.000Z";

function buildRequest(overrides: Partial<SeedRequest> = {}): SeedRequest {
  return {
    id: "seed-request",
    senderUserId: "seed-sender",
    senderEmail: "friend@example.com",
    recipientContact: session.email,
    recipientUserId: null,
    amountMinor: 4200,
    currency: "USD",
    note: "Shared dinner",
    status: "pending",
    shareToken: "seedsharetoken",
    createdAt: "2026-04-10T12:00:00.000Z",
    updatedAt: "2026-04-10T12:00:00.000Z",
    expiresAt: futureDate,
    paidAt: null,
    declinedAt: null,
    canceledAt: null,
    ...overrides,
  };
}

async function seedBrowser(page: Page, requests: SeedRequest[] = []) {
  await page.addInitScript(
    ({ nextSession, nextRequests }) => {
      window.localStorage.setItem("lovie:e2e:session", JSON.stringify(nextSession));

      if (nextRequests.length > 0) {
        window.localStorage.setItem("lovie:e2e:requests", JSON.stringify(nextRequests));
      }
    },
    {
      nextSession: session,
      nextRequests: requests,
    }
  );
}

test("auth entry starts an E2E session without email delivery", async ({ page }) => {
  await page.goto("/auth");
  await page.getByLabel("Email address").fill(session.email);
  await page.getByRole("button", { name: "Send magic link" }).click();

  await expect(page.getByText("E2E test session started.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Session ready" })).toBeVisible();
});

test("user creates a request and sees it in outgoing requests", async ({ page }) => {
  await seedBrowser(page);
  await page.goto("/requests/new");

  await page.getByLabel("Recipient email or phone").fill("friend@example.com");
  await page.getByLabel("Amount (USD)").fill("42.75");
  await page.getByLabel("Note (optional)").fill("Concert tickets");
  await page.getByRole("button", { name: "Create request" }).click();

  await expect(page.getByRole("heading", { name: "Your payment request is ready" })).toBeVisible();
  await expect(page.getByLabel("Shareable link")).toHaveValue(/\/requests\/[a-z0-9]+/);

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Requests you sent" })).toBeVisible();
  await expect(page.getByText("friend@example.com")).toBeVisible();
  await expect(page.getByText("Concert tickets")).toBeVisible();
});

test("dashboard search and status filters refine request lists", async ({ page }) => {
  await seedBrowser(page, [
    buildRequest({
      id: "outgoing-alex",
      senderEmail: session.email,
      recipientContact: "alex@example.com",
      note: "Coffee",
      shareToken: "outgoingalex",
    }),
    buildRequest({
      id: "outgoing-maya",
      senderEmail: session.email,
      recipientContact: "maya@example.com",
      note: "Train tickets",
      status: "paid",
      shareToken: "outgoingmaya",
    }),
  ]);

  await page.goto("/");

  await page.getByLabel("Search").fill("alex");
  await expect(page.getByText("alex@example.com")).toBeVisible();
  await expect(page.getByText("maya@example.com")).toBeHidden();

  await page.getByLabel("Search").fill("");
  await page.getByLabel("Status").selectOption("paid");
  await expect(page.getByText("maya@example.com")).toBeVisible();
  await expect(page.getByText("alex@example.com")).toBeHidden();
});

test("recipient pays a pending request with a recorded simulation state", async ({ page }) => {
  test.slow();

  await seedBrowser(page, [buildRequest({ shareToken: "payabletoken" })]);
  await page.goto("/requests/payabletoken");

  await expect(page.getByRole("heading", { name: "Incoming request" })).toBeVisible();
  await page.getByRole("button", { name: "Pay request" }).click();

  await expect(page.getByText("Processing payment simulation")).toBeVisible();
  await expect(page.getByText("Payment simulation completed successfully.")).toBeVisible();
  await expect(page.getByText("This request has already been paid.")).toBeVisible();
});

test("recipient declines an incoming request", async ({ page }) => {
  await seedBrowser(page, [buildRequest({ shareToken: "declinetoken" })]);
  await page.goto("/requests/declinetoken");

  await page.getByRole("button", { name: "Decline" }).click();

  await expect(page.getByText("Request declined.")).toBeVisible();
  await expect(page.getByText("This request has already been declined.")).toBeVisible();
});

test("expired requests cannot be fulfilled", async ({ page }) => {
  await seedBrowser(page, [
    buildRequest({
      expiresAt: pastDate,
      shareToken: "expiredtoken",
    }),
  ]);
  await page.goto("/requests/expiredtoken");

  await expect(page.getByText("Expired", { exact: true })).toBeVisible();
  await expect(page.getByText("This request expired and can no longer be paid")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pay request" })).toHaveCount(0);
});
