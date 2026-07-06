import type { LessonResource } from "../../data/resources/types";
import StatusBadge from "./StatusBadge";

interface ComingSoonResourceCardProps {
  lesson: LessonResource;
}

const ComingSoonResourceCard: React.FC<ComingSoonResourceCardProps> = ({
  lesson,
}) => {
  return (
    <article className="resource-card lesson-card lesson-card--coming-soon">
      <div className="lesson-card-header">
        <span className="lesson-number-badge">Lesson {lesson.lessonNumber}</span>
        <StatusBadge variant="coming_soon" />
      </div>
      <div className="lesson-preview-placeholder" aria-hidden="true">
        <span className="lesson-preview-icon">
          {lesson.format === "cheat-sheets" ? "Clipboard" : "Notes"}
        </span>
      </div>
      <h3>{lesson.title}</h3>
      <p>{lesson.comingSoonCopy ?? lesson.description}</p>
      <a href="/#join" className="btn btn-ghost topic-card-cta">
        Get notified
      </a>
    </article>
  );
};

export default ComingSoonResourceCard;
