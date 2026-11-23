import type { StatusSummary } from '../../app/shell-content';

export function GlobalStatus({
  era,
  edition,
  status,
}: {
  era: string;
  edition: string;
  status: readonly StatusSummary[];
}) {
  return (
    <section className="global-status" aria-label="Global status">
      <div className="machine-identity">
        <span className="status-light" aria-hidden="true" />
        <div>
          <p className="eyebrow">{era}</p>
          <p className="small-note">{edition}</p>
        </div>
      </div>
      <dl className="status-values">
        {status.map(({ label, value, note }) => (
          <div className="status-value" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
            <dd className="small-note">{note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
