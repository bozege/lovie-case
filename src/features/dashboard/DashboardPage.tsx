import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import { StatusBadge } from "../../components/StatusBadge";
import { formatMoney } from "../../lib/money/amount";
import { getTimeRemaining } from "../../lib/request-status";
import type { PaymentRequest, RequestStatus } from "../../lib/types";
import { DashboardFilters } from "./DashboardFilters";
import { filterRequests } from "./dashboard.filters";
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
  const [includeSelfRequests, setIncludeSelfRequests] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | RequestStatus>("all");
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
          setIncomingRequests(incoming);
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

  const filteredOutgoingRequests = filterRequests(outgoingRequests, {
    search,
    selectedStatus,
    role: "outgoing",
  });

  const filteredIncomingRequests = filterRequests(incomingRequests, {
    search,
    selectedStatus,
    role: "incoming",
  }).filter((request) => includeSelfRequests || request.senderEmail !== email);

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

      <article className="panel">
        <div className="panel__heading">
          <div>
            <p className="eyebrow">Filters</p>
            <h2>Search and status refinement</h2>
          </div>
          <p className="muted">
            Use one set of filters across both incoming and outgoing request lists.
          </p>
        </div>

        <DashboardFilters
          includeSelfRequests={includeSelfRequests}
          onIncludeSelfRequestsChange={setIncludeSelfRequests}
          onSearchChange={setSearch}
          onStatusChange={setSelectedStatus}
          search={search}
          selectedStatus={selectedStatus}
        />
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

          {!isFetching && !error && filteredOutgoingRequests.length === 0 ? (
            <div className="empty-state">
              <p className="muted">
                {outgoingRequests.length === 0
                  ? "No outgoing requests yet. Create your first one."
                  : "No outgoing requests match the current filters."}
              </p>
            </div>
          ) : null}

          <div className="request-list">
            {filteredOutgoingRequests.map((request) => (
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

          {!isFetching && !error && filteredIncomingRequests.length === 0 ? (
            <div className="empty-state">
              <p className="muted">
                {incomingRequests.length === 0
                  ? "No incoming requests match your signed-in email yet."
                  : "No incoming requests match the current filters."}
              </p>
            </div>
          ) : null}

          <div className="request-list">
            {filteredIncomingRequests.map((request) => (
              <RequestCard key={request.id} label="Sender" request={request} />
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
