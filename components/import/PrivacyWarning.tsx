export function PrivacyWarning() {
  return (
    <div className="mt-8 rounded-xl border border-warm bg-surface/40 px-5 py-4 text-sm leading-relaxed text-warm-muted">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary mb-2">
        ✺ Privacy
      </p>
      <p>
        Don&apos;t paste passwords, financial info, medical or legal details,
        or confidential work data. Your text goes to Anthropic&apos;s Claude
        API for analysis — never to our servers.{" "}
        <span className="text-warm">
          Your archive is saved in this browser only.
        </span>{" "}
        Hit <em className="text-warm">Start over</em> from the dashboard any
        time to wipe it.
      </p>
    </div>
  );
}
