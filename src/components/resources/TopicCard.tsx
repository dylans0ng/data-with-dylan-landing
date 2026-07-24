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
  const availableResourceLabel =
    topic.availableResourceCount === 1 ? "resource" : "resources";
  const availableLessonLabel =
    topic.availableLessonCount === 1 ? "lesson" : "lessons";
  const upcomingLessonLabel =
    topic.mysteryLessonCount === 1 ? "lesson" : "lessons";

  return (
    <article className="resource-card topic-card">
      <div className="resource-icon" aria-hidden="true">
        {topic.iconAsset ? (
          <img
            src={topic.iconAsset}
            alt=""
            className={`resource-icon-image${
              topic.slug === "sql-fundamentals" ? " resource-icon-image--sql" : ""
            }`}
          />
        ) : (
          topic.icon
        )}
      </div>
      <div className="topic-card-badges">
        {topic.status === "partial" ? (
          <>
            <StatusBadge variant="new_resource" />
            <StatusBadge variant="more_coming" />
          </>
        ) : (
          <>
            <StatusBadge variant="available" />
            {topic.slug === "ai-with-python-for-beginners" && (
              <StatusBadge variant="more_coming" />
            )}
          </>
        )}
      </div>
      <h3>{topic.title}</h3>
      <p>{topic.shortDescription}</p>
      {topic.cardMetaText ? (
        <p className="topic-card-meta">{topic.cardMetaText}</p>
      ) : topic.status === "partial" && topic.mysteryLessonCount ? (
        <p className="topic-card-meta">
          {topic.availableLessonCount} {availableLessonLabel} available ·{" "}
          {topic.mysteryLessonCount} {upcomingLessonLabel} coming
        </p>
      ) : topic.status === "partial" && topic.availableResourceCount ? (
        <p className="topic-card-meta">
          {topic.availableResourceCount} {availableResourceLabel} available ·
          More coming
        </p>
      ) : (
        <p className="topic-card-meta">
          {topic.lessonCount} {lessonLabel} · {formatLabels}
        </p>
      )}
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
