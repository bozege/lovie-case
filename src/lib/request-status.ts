import type { RequestStatus } from "./types";

export function isExpired(expiresAt: string, now = new Date()) {
  return new Date(expiresAt).getTime() <= now.getTime();
}

export function getEffectiveStatus(status: RequestStatus, expiresAt: string) {
  if (status === "pending" && isExpired(expiresAt)) {
    return "expired" satisfies RequestStatus;
  }

  return status;
}

export function canCancel(status: RequestStatus, expiresAt: string) {
  return getEffectiveStatus(status, expiresAt) === "pending";
}

export function canResolve(status: RequestStatus, expiresAt: string) {
  return getEffectiveStatus(status, expiresAt) === "pending";
}

export function getTimeRemaining(expiresAt: string, now = new Date()) {
  const diff = new Date(expiresAt).getTime() - now.getTime();

  if (diff <= 0) {
    return "Expired";
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  return `${minutes}m remaining`;
}
