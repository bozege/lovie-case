import { getTimeRemaining } from "../../lib/request-status";

type ExpirationCountdownProps = {
  expiresAt: string;
};

export function ExpirationCountdown({ expiresAt }: ExpirationCountdownProps) {
  return <p className="inline-note">{getTimeRemaining(expiresAt)}</p>;
}
