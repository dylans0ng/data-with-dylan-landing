import { Link } from "react-router-dom";
import type { ResourceFormat } from "../../data/resources/types";
import { FORMAT_DESCRIPTIONS, FORMAT_LABELS } from "../../data/resources/types";
import StatusBadge from "./StatusBadge";

interface FormatChooserCardProps {
  topicSlug: string;
  format: ResourceFormat;
  publishedCount: number;
  plannedCount?: number;
  comingSoonCopy?: string;
}

const FORMAT_ICONS: Record<ResourceFormat, string> = {
  "cheat-sheets": "📋",
  "guided-notes": "📝",
};

const FormatChooserCard: React.FC<FormatChooserCardProps> = ({
  topicSlug,
  format,
  publishedCount,
  plannedCount = 0,
  comingSoonCopy,
}) => {
  const isAvailable = publishedCount > 0;
  const resourceLabel = publishedCount === 1 ? "resource" : "resources";
  const plannedLabel = plannedCount === 1 ? "resource" : "resources";

  return (
    <article className="resource-card format-chooser-card">
      <div className="resource-icon" aria-hidden="true">
        {FORMAT_ICONS[format]}
      </div>
      {!isAvailable && (
        <div className="topic-card-badges">
          <StatusBadge variant="coming_soon" />
        </div>
      )}
      <h3>{FORMAT_LABELS[format]}</h3>
      <p>{comingSoonCopy ?? FORMAT_DESCRIPTIONS[format]}</p>
      <p className="topic-card-meta">
        {isAvailable
          ? `${publishedCount} ${resourceLabel}`
          : `${plannedCount} planned ${plannedLabel}`}
      </p>
      {isAvailable ? (
        <Link
          to={`/resources/${topicSlug}/${format}`}
          className="btn btn-secondary topic-card-cta"
        >
          Browse {FORMAT_LABELS[format].toLowerCase()} →
        </Link>
      ) : (
        <a href="/#join" className="btn btn-ghost topic-card-cta">
          Get notified
        </a>
      )}
    </article>
  );
};

export default FormatChooserCard;
