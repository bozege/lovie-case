type RequestCreateSuccessProps = {
  shareToken: string;
};

export function RequestCreateSuccess({ shareToken }: RequestCreateSuccessProps) {
  const shareUrl = `${window.location.origin}/requests/${shareToken}`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
  }

  return (
    <section className="panel form-panel">
      <p className="eyebrow">Request Created</p>
      <h2>Your payment request is ready</h2>
      <p className="muted">
        Share this link with your recipient. The request will expire in 7 days.
      </p>

      <label className="field">
        <span>Shareable link</span>
        <input readOnly value={shareUrl} />
      </label>

      <div className="success-actions">
        <button className="primary-button" onClick={() => void copyLink()} type="button">
          Copy link
        </button>
      </div>
    </section>
  );
}
