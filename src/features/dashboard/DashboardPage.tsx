import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import { StatusBadge } from "../../components/StatusBadge";
import { formatMoney } from "../../lib/money/amount";
import type { PaymentRequest } from "../../lib/types";
import { listOutgoingRequests } from "./dashboard.service";

export function DashboardPage() {
  const { email, isAuthenticated, isLoading } = useAuth();
  const [outgoingRequests, setOutgoingRequests] = useState<PaymentRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !email) {
      setOutgoingRequests([]);
      return;
    }

    const senderEmail = email;
    let cancelled = false;

    async function loadRequests() {
      setIsFetching(true);
      setError(null);

      try {
        const requests = await listOutgoingRequests(senderEmail);

        if (!cancelled) {
          setOutgoingRequests(requests);
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
  }, [email, isAuthenticated]);

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
          <p className="muted">Restoring session…</p>
        ) : isAuthenticated ? (
          <p className="muted">
            Signed in as <strong>{email}</strong>. You can now create a payment
            request and see your outgoing requests below.
          </p>
        ) : (
          <div className="empty-state">
            <p className="muted">
              Sign in first to create or manage payment requests.
            </p>
            <Link className="primary-link" to="/auth">
              Go to sign in
            </Link>
          </div>
        )}
      </article>

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

        {isFetching ? <p className="muted">Loading outgoing requests…</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!isFetching && !error && outgoingRequests.length === 0 ? (
          <div className="empty-state">
            <p className="muted">No outgoing requests yet. Create your first one.</p>
          </div>
        ) : null}

        <div className="request-list">
          {outgoingRequests.map((request) => (
            <Link
              className="request-card"
              key={request.id}
              to={`/requests/${request.shareToken}`}
            >
              <div className="request-card__row">
                <div>
                  <p className="request-card__label">Recipient</p>
                  <strong>{request.recipientContact}</strong>
                </div>
                <StatusBadge status={request.status} />
              </div>

              <p className="amount-preview">{formatMoney(request.amountMinor)}</p>
              <p className="muted">{request.note ?? "No note added"}</p>
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
