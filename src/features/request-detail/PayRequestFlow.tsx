type PayRequestFlowProps = {
  isProcessing: boolean;
};

export function PayRequestFlow({ isProcessing }: PayRequestFlowProps) {
  if (!isProcessing) {
    return null;
  }

  return (
    <div className="inline-banner inline-banner--info">
      Processing payment simulation... This will complete in about 2-3 seconds.
    </div>
  );
}
