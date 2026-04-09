import { StatusBadge } from "../../components/StatusBadge";
import { formatMoney } from "../../lib/money/amount";

export function DashboardPage() {
  return (
    <section className="dashboard-grid">
      <article className="panel">
        <div className="panel__heading">
          <div>
            <p className="eyebrow">Outgoing</p>
            <h2>Requests you sent</h2>
          </div>
          <StatusBadge status="pending" />
        </div>
        <p className="muted">
          Placeholder dashboard card for scaffold verification.
        </p>
        <p className="amount-preview">{formatMoney(2450)}</p>
      </article>

      <article className="panel">
        <div className="panel__heading">
          <div>
            <p className="eyebrow">Incoming</p>
            <h2>Requests you received</h2>
          </div>
          <StatusBadge status="paid" />
        </div>
        <p className="muted">
          Incoming, filters, and live data wiring will be implemented next.
        </p>
        <p className="amount-preview">{formatMoney(1200)}</p>
      </article>
    </section>
  );
}
