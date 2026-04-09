import type { RequestStatus } from "./types";

export function isExpired(expiresAt: string, now = new Date()) {
  return new Date(expiresAt).getTime() <= now.getTime();
}

export function canCancel(status: RequestStatus, expiresAt: string) {
  return status === "pending" && !isExpired(expiresAt);
}

export function canResolve(status: RequestStatus, expiresAt: string) {
  return status === "pending" && !isExpired(expiresAt);
}
