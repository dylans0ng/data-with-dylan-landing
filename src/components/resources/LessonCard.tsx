import { Link } from "react-router-dom";
import type { LessonResource } from "../../data/resources/types";
import StatusBadge from "./StatusBadge";

interface LessonCardProps {
  lesson: LessonResource;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const detailPath = `/resources/${lesson.topicSlug}/${lesson.format}/${lesson.slug}`;

  return (
    <article className="resource-card lesson-card">
      <div className="lesson-card-header">
        <span className="lesson-number-badge">Lesson {lesson.lessonNumber}</span>
        <StatusBadge variant={lesson.format} />
      </div>
      <div className="lesson-preview-placeholder" aria-hidden="true">
        {lesson.thumbnailAsset ? (
          <img
            src={lesson.thumbnailAsset}
            alt=""
            className="lesson-card-preview-image"
          />
        ) : (
          <span className="lesson-preview-icon">
            {lesson.format === "cheat-sheets" ? "Clipboard" : "Notes"}
          </span>
        )}
      </div>
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <Link to={detailPath} className="btn btn-secondary topic-card-cta">
        View resource
      </Link>
    </article>
  );
};

export default LessonCard;
