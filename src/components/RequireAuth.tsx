import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../app/auth-context";

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <section className="panel">
        <h2>Checking your session</h2>
        <p className="muted">Please wait while we restore your magic-link session.</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="panel">
        <p className="eyebrow">Authentication Required</p>
        <h2>Sign in to continue</h2>
        <p className="muted">
          You need an authenticated session before creating or managing requests.
        </p>
        <Link className="primary-link" to="/auth" state={{ from: location.pathname }}>
          Go to sign in
        </Link>
      </section>
    );
  }

  return <Outlet />;
}
