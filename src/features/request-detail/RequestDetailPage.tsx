import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../app/auth-context";
import { StatusBadge } from "../../components/StatusBadge";
import { formatMoney } from "../../lib/money/amount";
import type { PaymentRequest } from "../../lib/types";
import { getRequestByShareToken } from "../dashboard/dashboard.service";
import {
  cancelRequest,
  declineRequest,
  isRecipient,
  isSender,
  payRequest,
} from "./request-detail.service";
import { ExpirationCountdown } from "./ExpirationCountdown";
import { PayRequestFlow } from "./PayRequestFlow";
import { RequestActions } from "./RequestActions";

export function RequestDetailPage() {
  const { requestId } = useParams();
  const { email, isLoading } = useAuth();
  const [request, setRequest] = useState<PaymentRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const shareToken = requestId ?? null;

  useEffect(() => {
    if (!shareToken) {
      return;
    }

    const activeShareToken = shareToken;
    let cancelled = false;

    async function loadRequest() {
      setIsFetching(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const nextRequest = await getRequestByShareToken(activeShareToken);

        if (!cancelled) {
          setRequest(nextRequest);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load request");
        }
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    }

    void loadRequest();

    return () => {
      cancelled = true;
    };
  }, [shareToken]);

  async function refreshRequest() {
    if (!shareToken) {
      return;
    }

    const activeShareToken = shareToken;
    const nextRequest = await getRequestByShareToken(activeShareToken);
    setRequest(nextRequest);
  }

  async function runMutation(action: "pay" | "decline" | "cancel") {
    if (!request || !email) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsMutating(true);

    try {
      if (action === "pay") {
        await new Promise((resolve) => window.setTimeout(resolve, 2200));
        await payRequest({ request, actorEmail: email });
        setSuccessMessage("Payment simulation completed successfully.");
      }

      if (action === "decline") {
        await declineRequest({ request, actorEmail: email });
        setSuccessMessage("Request declined.");
      }

      if (action === "cancel") {
        await cancelRequest({ request, actorEmail: email });
        setSuccessMessage("Request canceled.");
      }

      await refreshRequest();
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Request action failed");
    } finally {
      setIsMutating(false);
    }
  }

  if (isLoading || isFetching) {
    return (
      <section className="panel">
        <h2>Loading request…</h2>
        <p className="muted">Fetching the latest request detail and status.</p>
      </section>
    );
  }

  if (error && !request) {
    return (
      <section className="panel">
        <p className="eyebrow">Request Detail</p>
        <h2>Could not load this request</h2>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  if (!request || !email) {
    return null;
  }

  const sender = isSender(request, email);
  const recipient = isRecipient(request, email);

  if (!sender && !recipient) {
    return (
      <section className="panel">
        <p className="eyebrow">Request Detail</p>
        <h2>Access limited</h2>
        <p className="muted">
          You are signed in, but this request is not addressed to your email and was not
          created by you.
        </p>
      </section>
    );
  }

  return (
    <section className="detail-layout">
      <article className="panel">
        <div className="panel__heading">
          <div>
            <p className="eyebrow">Request Detail</p>
            <h2>{sender ? "Outgoing request" : "Incoming request"}</h2>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <p className="amount-preview">{formatMoney(request.amountMinor)}</p>
        <p className="muted">{request.note ?? "No note added"}</p>
        <ExpirationCountdown expiresAt={request.expiresAt} />

        <div className="detail-grid">
          <div>
            <p className="request-card__label">Sender</p>
            <strong>{request.senderEmail}</strong>
          </div>
          <div>
            <p className="request-card__label">Recipient</p>
            <strong>{request.recipientContact}</strong>
          </div>
          <div>
            <p className="request-card__label">Created</p>
            <strong>{new Date(request.createdAt).toLocaleString()}</strong>
          </div>
          <div>
            <p className="request-card__label">Share token</p>
            <strong>{request.shareToken}</strong>
          </div>
        </div>

        <PayRequestFlow isProcessing={isMutating} />

        {successMessage ? <p className="success-text">{successMessage}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </article>

      <article className="panel">
        <p className="eyebrow">Actions</p>
        <h2>Available actions</h2>
        <p className="muted">
          Recipients can pay or decline pending requests. Senders can cancel their
          own pending requests.
        </p>

        <RequestActions
          actorEmail={email}
          isMutating={isMutating}
          onCancel={() => void runMutation("cancel")}
          onDecline={() => void runMutation("decline")}
          onPay={() => void runMutation("pay")}
          request={request}
        />
      </article>
    </section>
  );
}
