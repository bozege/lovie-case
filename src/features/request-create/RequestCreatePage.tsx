import { useState } from "react";
import { useAuth } from "../../app/auth-context";
import { createPaymentRequest } from "./request-create.service";
import { RequestCreateSuccess } from "./RequestCreateSuccess";

export function RequestCreatePage() {
  const { email, userId } = useAuth();
  const [recipientContact, setRecipientContact] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!email || !userId) {
    return null;
  }

  const senderEmail = email;
  const senderUserId = userId;

  if (successToken) {
    return <RequestCreateSuccess shareToken={successToken} />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createPaymentRequest({
        senderEmail,
        senderUserId,
        recipientContact,
        amount,
        note,
      });

      setSuccessToken(result.shareToken);
      setRecipientContact("");
      setAmount("");
      setNote("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to create request"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel form-panel">
      <p className="eyebrow">Create Request</p>
      <h2>Request money from a friend</h2>
      <p className="muted">
        Signed in as <strong>{senderEmail}</strong>. Recipient can be an email or
        phone number.
      </p>

      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Recipient email or phone</span>
          <input
            onChange={(event) => setRecipientContact(event.target.value)}
            placeholder="friend@example.com"
            required
            value={recipientContact}
          />
        </label>

        <label className="field">
          <span>Amount (USD)</span>
          <input
            inputMode="decimal"
            min="0.01"
            onChange={(event) => setAmount(event.target.value)}
            placeholder="24.50"
            required
            step="0.01"
            value={amount}
          />
        </label>

        <label className="field">
          <span>Note (optional)</span>
          <textarea
            maxLength={140}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Dinner split"
            rows={4}
            value={note}
          />
        </label>

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating request..." : "Create request"}
        </button>
      </form>

      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
