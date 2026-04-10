import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import { StatusBadge } from "../../components/StatusBadge";
import { formatMoney } from "../../lib/money/amount";
import { getTimeRemaining } from "../../lib/request-status";
import type { PaymentRequest } from "../../lib/types";
import { listIncomingRequests, listOutgoingRequests } from "./dashboard.service";

function RequestCard({
  request,
  label,
}: {
  request: PaymentRequest;
  label: string;
}) {
  return (
    <Link className="request-card" to={`/requests/${request.shareToken}`}>
      <div className="request-card__row">
        <div>
          <p className="request-card__label">{label}</p>
          <strong>{label === "Recipient" ? request.recipientContact : request.senderEmail}</strong>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <p className="amount-preview">{formatMoney(request.amountMinor)}</p>
      <p className="muted">{request.note ?? "No note added"}</p>
      <p className="request-card__meta">{getTimeRemaining(request.expiresAt)}</p>
    </Link>
  );
}

export function DashboardPage() {
  const { email, userId, isAuthenticated, isLoading } = useAuth();
  const [outgoingRequests, setOutgoingRequests] = useState<PaymentRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<PaymentRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !email || !userId) {
      setOutgoingRequests([]);
      setIncomingRequests([]);
      return;
    }

    const senderEmail = email;
    const actorId = userId;
    let cancelled = false;

    async function loadRequests() {
      setIsFetching(true);
      setError(null);

      try {
        const [outgoing, incoming] = await Promise.all([
          listOutgoingRequests(senderEmail),
          listIncomingRequests(senderEmail, actorId),
        ]);

        if (!cancelled) {
          setOutgoingRequests(outgoing);
          setIncomingRequests(incoming.filter((request) => request.senderEmail !== senderEmail));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load requests");
        }
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    }

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, [email, isAuthenticated, userId]);

  return (
    <section className="dashboard-stack">
      <article className="panel">
        <div className="panel__heading">
          <div>
            <p className="eyebrow">Status</p>
            <h2>Workspace overview</h2>
          </div>
          <StatusBadge status={isAuthenticated ? "paid" : "pending"} />
        </div>

        {isLoading ? (
          <p className="muted">Restoring session...</p>
        ) : isAuthenticated ? (
          <p className="muted">
            Signed in as <strong>{email}</strong>. Create requests, review incoming asks,
            and open any request to pay, decline, or cancel it.
          </p>
        ) : (
          <div className="empty-state">
            <p className="muted">Sign in first to create or manage payment requests.</p>
            <Link className="primary-link" to="/auth">
              Go to sign in
            </Link>
          </div>
        )}
      </article>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel__heading">
            <div>
              <p className="eyebrow">Outgoing</p>
              <h2>Requests you sent</h2>
            </div>
            <Link className="primary-link" to="/requests/new">
              Create request
            </Link>
          </div>

          {isFetching ? <p className="muted">Loading outgoing requests...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          {!isFetching && !error && outgoingRequests.length === 0 ? (
            <div className="empty-state">
              <p className="muted">No outgoing requests yet. Create your first one.</p>
            </div>
          ) : null}

          <div className="request-list">
            {outgoingRequests.map((request) => (
              <RequestCard key={request.id} label="Recipient" request={request} />
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel__heading">
            <div>
              <p className="eyebrow">Incoming</p>
              <h2>Requests you received</h2>
            </div>
            <StatusBadge status="pending" />
          </div>

          {isFetching ? <p className="muted">Loading incoming requests...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          {!isFetching && !error && incomingRequests.length === 0 ? (
            <div className="empty-state">
              <p className="muted">
                No incoming requests match your signed-in email yet.
              </p>
            </div>
          ) : null}

          <div className="request-list">
            {incomingRequests.map((request) => (
              <RequestCard key={request.id} label="Sender" request={request} />
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
