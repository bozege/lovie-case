import { Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div>
          <p className="eyebrow">Lovie Case</p>
          <h1>P2P Payment Requests</h1>
        </div>
        <p className="app-shell__hint">Spec-first build in progress</p>
      </header>
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
