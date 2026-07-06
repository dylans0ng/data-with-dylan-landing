import { Link } from "react-router-dom";
import type { ResourceFormat } from "../../data/resources/types";
import { FORMAT_DESCRIPTIONS, FORMAT_LABELS } from "../../data/resources/types";

interface FormatChooserCardProps {
  topicSlug: string;
  format: ResourceFormat;
  lessonCount: number;
}

const FORMAT_ICONS: Record<ResourceFormat, string> = {
  "cheat-sheets": "📋",
  "guided-notes": "📝",
};

const FormatChooserCard: React.FC<FormatChooserCardProps> = ({
  topicSlug,
  format,
  lessonCount,
}) => {
  const lessonLabel = lessonCount === 1 ? "lesson" : "lessons";

  return (
    <article className="resource-card format-chooser-card">
      <div className="resource-icon" aria-hidden="true">
        {FORMAT_ICONS[format]}
      </div>
      <h3>{FORMAT_LABELS[format]}</h3>
      <p>{FORMAT_DESCRIPTIONS[format]}</p>
      <p className="topic-card-meta">
        {lessonCount} {lessonLabel}
      </p>
      <Link
        to={`/resources/${topicSlug}/${format}`}
        className="btn btn-secondary topic-card-cta"
      >
        Browse {FORMAT_LABELS[format].toLowerCase()} →
      </Link>
    </article>
  );
};

export default FormatChooserCard;
