import { Link } from "react-router-dom";
import type { ResourceFormat } from "../../data/resources/types";
import { FORMAT_LABELS } from "../../data/resources/types";

interface FormatToggleProps {
  topicSlug: string;
  activeFormat: ResourceFormat;
}

const FormatToggle: React.FC<FormatToggleProps> = ({
  topicSlug,
  activeFormat,
}) => {
  const formats: ResourceFormat[] = ["cheat-sheets", "guided-notes"];

  return (
    <div
      className="format-toggle"
      role="tablist"
      aria-label="Resource format"
    >
      {formats.map((format) => {
        const isActive = format === activeFormat;
        const to = `/resources/${topicSlug}/${format}`;

        return (
          <Link
            key={format}
            to={to}
            role="tab"
            aria-selected={isActive}
            className={`format-toggle-pill${isActive ? " format-toggle-pill--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {FORMAT_LABELS[format]}
          </Link>
        );
      })}
    </div>
  );
};

export default FormatToggle;
