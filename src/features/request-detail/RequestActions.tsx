import { canCancel, canResolve } from "../../lib/request-status";
import type { PaymentRequest } from "../../lib/types";
import { isRecipient, isSender } from "./request-detail.service";

type RequestActionsProps = {
  actorEmail: string;
  isMutating: boolean;
  onPay: () => void;
  onDecline: () => void;
  onCancel: () => void;
  request: PaymentRequest;
};

export function RequestActions({
  actorEmail,
  isMutating,
  onPay,
  onDecline,
  onCancel,
  request,
}: RequestActionsProps) {
  const sender = isSender(request, actorEmail);
  const recipient = isRecipient(request, actorEmail);
  const canActAsRecipient = recipient && canResolve(request.status, request.expiresAt);
  const canActAsSender = sender && canCancel(request.status, request.expiresAt);

  return (
    <div className="action-row">
      {canActAsRecipient ? (
        <>
          <button className="primary-button" disabled={isMutating} onClick={onPay} type="button">
            Pay request
          </button>
          <button className="secondary-button" disabled={isMutating} onClick={onDecline} type="button">
            Decline
          </button>
        </>
      ) : null}

      {canActAsSender ? (
        <button className="secondary-button" disabled={isMutating} onClick={onCancel} type="button">
          Cancel request
        </button>
      ) : null}
    </div>
  );
}
