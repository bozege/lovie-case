import { getEffectiveStatus } from "./request-status";
import type { PaymentRequest } from "./types";

export const isE2eMode = import.meta.env.VITE_E2E_MODE === "true";

export const e2eStorageKeys = {
  session: "lovie:e2e:session",
  requests: "lovie:e2e:requests",
};

export type E2eSession = {
  userId: string;
  email: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readE2eSession() {
  if (!canUseStorage()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(e2eStorageKeys.session);

  if (!rawSession) {
    return null;
  }

  return JSON.parse(rawSession) as E2eSession;
}

export function writeE2eSession(email: string) {
  if (!canUseStorage()) {
    return null;
  }

  const session = {
    userId: `e2e-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    email,
  };

  window.localStorage.setItem(e2eStorageKeys.session, JSON.stringify(session));
  return session;
}

export function clearE2eSession() {
  if (canUseStorage()) {
    window.localStorage.removeItem(e2eStorageKeys.session);
  }
}

export function readE2eRequests() {
  if (!canUseStorage()) {
    return [];
  }

  const rawRequests = window.localStorage.getItem(e2eStorageKeys.requests);

  if (!rawRequests) {
    return [];
  }

  const requests = JSON.parse(rawRequests) as PaymentRequest[];

  return requests.map((request) => ({
    ...request,
    status: getEffectiveStatus(request.status, request.expiresAt),
  }));
}

export function writeE2eRequests(requests: PaymentRequest[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(e2eStorageKeys.requests, JSON.stringify(requests));
  }
}

export function upsertE2eRequest(request: PaymentRequest) {
  const requests = readE2eRequests();
  writeE2eRequests([request, ...requests.filter((item) => item.id !== request.id)]);
}

export function updateE2eRequest(requestId: string, updates: Partial<PaymentRequest>) {
  const requests = readE2eRequests();

  writeE2eRequests(
    requests.map((request) =>
      request.id === requestId
        ? {
            ...request,
            ...updates,
          }
        : request
    )
  );
}
