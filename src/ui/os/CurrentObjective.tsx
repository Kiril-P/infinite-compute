import type { Navigate } from '../../app/navigation';
import type { ObjectiveSummary } from '../../app/shell-content';

export function CurrentObjective({
  objective,
  onNavigate,
}: {
  objective: ObjectiveSummary;
  onNavigate: Navigate;
}) {
  return (
    <section className="objective" aria-labelledby="objective-title">
      <div className="objective-marker" aria-hidden="true">
        !
      </div>
      <div className="objective-copy">
        <h2 className="eyebrow" id="objective-title">
          {objective.title}
        </h2>
        <p className="objective-outcome">{objective.outcome}</p>
        <p className="muted">{objective.description}</p>
      </div>
      <div className="objective-action">
        <button
          className="primary-button"
          type="button"
          aria-controls={objective.command.applicationId}
          onClick={() => onNavigate(objective.command)}
        >
          {objective.action} <span aria-hidden="true">→</span>
        </button>
        <span className="small-note">{objective.note}</span>
      </div>
    </section>
  );
}
