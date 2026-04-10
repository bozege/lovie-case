import { useParams } from "react-router-dom";

export function RequestDetailPage() {
  const { requestId } = useParams();

  return (
    <section className="panel">
      <p className="eyebrow">Request Detail</p>
      <h2>Request lifecycle view</h2>
      <p className="muted">
        Detail page wiring is next. Current route parameter: <strong>{requestId}</strong>
      </p>
    </section>
  );
}
