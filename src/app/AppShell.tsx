import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./auth-context";

export function AppShell() {
  const { email, isAuthenticated, isLoading, signOutUser } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div>
          <p className="eyebrow">Lovie Case</p>
          <h1>P2P Payment Requests</h1>
          <p className="app-shell__hint">
            Request money, manage incoming asks, and simulate fulfillment.
          </p>
        </div>

        <div className="app-shell__account">
          <nav className="app-shell__nav">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/requests/new">New Request</NavLink>
            <NavLink to="/auth">{isAuthenticated ? "Account" : "Sign In"}</NavLink>
          </nav>

          {isLoading ? (
            <p className="muted">Checking session…</p>
          ) : isAuthenticated ? (
            <div className="account-chip">
              <span>{email}</span>
              <button className="link-button" onClick={() => void signOutUser()}>
                Sign out
              </button>
            </div>
          ) : (
            <Link className="primary-link" to="/auth">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
