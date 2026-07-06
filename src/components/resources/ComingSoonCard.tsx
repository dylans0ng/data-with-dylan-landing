import type { Topic } from "../../data/resources/types";
import { FORMAT_LABELS } from "../../data/resources/types";
import StatusBadge from "./StatusBadge";

interface ComingSoonCardProps {
  topic: Topic;
}

const ComingSoonCard: React.FC<ComingSoonCardProps> = ({ topic }) => {
  const formatLabels = topic.formats
    .map((format) => FORMAT_LABELS[format])
    .join(" · ");
  const lessonLabel = topic.lessonCount === 1 ? "lesson" : "lessons";

  return (
    <article
      className="resource-card topic-card topic-card--coming-soon"
      aria-disabled="true"
    >
      <div className="resource-icon" aria-hidden="true">
        {topic.icon}
      </div>
      <div className="topic-card-badges">
        <StatusBadge variant="coming_soon" />
      </div>
      <h3>{topic.title}</h3>
      <p>{topic.shortDescription}</p>
      {topic.lessonCount > 0 && (
        <p className="topic-card-meta">
          {topic.lessonCount} {lessonLabel} · {formatLabels}
        </p>
      )}
      <span className="btn btn-secondary topic-card-cta topic-card-cta--disabled">
        Coming soon
      </span>
    </article>
  );
};

export default ComingSoonCard;
