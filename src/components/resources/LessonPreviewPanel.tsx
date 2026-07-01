import type { ResourceFormat } from "../../data/resources/types";
import { FORMAT_LABELS } from "../../data/resources/types";

interface LessonPreviewPanelProps {
  format: ResourceFormat;
  title: string;
  thumbnailAsset?: string;
}

const LessonPreviewPanel: React.FC<LessonPreviewPanelProps> = ({
  format,
  title,
  thumbnailAsset,
}) => {
  return (
    <div className="lesson-preview-panel" aria-label={`Preview for ${title}`}>
      {thumbnailAsset ? (
        <img
          src={thumbnailAsset}
          alt=""
          className="lesson-preview-panel-image"
          aria-hidden="true"
        />
      ) : (
        <div className="lesson-preview-panel-inner" aria-hidden="true">
          <span className="lesson-preview-panel-icon">
            {format === "cheat-sheets" ? "Clipboard" : "Notes"}
          </span>
          <p className="lesson-preview-panel-label">
            {FORMAT_LABELS[format]} preview
          </p>
          <p className="lesson-preview-panel-note">Full preview coming soon</p>
        </div>
      )}
    </div>
  );
};

export default LessonPreviewPanel;
