import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import { sendMagicLink } from "../../lib/supabase/auth";

export function AuthPage() {
  const { email, isAuthenticated } = useAuth();
  const location = useLocation();
  const [address, setAddress] = useState(email ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state
      ? String(location.state.from)
      : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const { error: signInError } = await sendMagicLink(address.trim());

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage("Magic link sent. Check your inbox and return here after opening it.");
    }

    setIsSubmitting(false);
  }

  return (
    <section className="panel form-panel">
      <p className="eyebrow">Authentication</p>
      <h2>{isAuthenticated ? "Session ready" : "Sign in with email"}</h2>
      <p className="muted">
        {isAuthenticated
          ? `You are signed in as ${email}.`
          : "Use Supabase magic-link auth to access request creation and management."}
      </p>

      {from ? <p className="inline-note">After signing in, return to: {from}</p> : null}

      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="name@example.com"
            required
          />
        </label>

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending link…" : "Send magic link"}
        </button>
      </form>

      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
