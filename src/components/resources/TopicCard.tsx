import { Link } from "react-router-dom";
import type { Topic } from "../../data/resources/types";
import { FORMAT_LABELS } from "../../data/resources/types";
import StatusBadge from "./StatusBadge";

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const formatLabels = topic.formats
    .map((format) => FORMAT_LABELS[format])
    .join(" · ");
  const lessonLabel = topic.lessonCount === 1 ? "lesson" : "lessons";

  return (
    <article className="resource-card topic-card">
      <div className="resource-icon" aria-hidden="true">
        {topic.iconAsset ? (
          <img src={topic.iconAsset} alt="" className="resource-icon-image" />
        ) : (
          topic.icon
        )}
      </div>
      <div className="topic-card-badges">
        <StatusBadge variant="available" />
      </div>
      <h3>{topic.title}</h3>
      <p>{topic.shortDescription}</p>
      <p className="topic-card-meta">
        {topic.lessonCount} {lessonLabel} · {formatLabels}
      </p>
      <Link
        to={`/resources/${topic.slug}`}
        className="btn btn-secondary topic-card-cta"
      >
        Explore collection →
      </Link>
    </article>
  );
};

export default TopicCard;
