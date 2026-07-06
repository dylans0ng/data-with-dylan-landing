import { Link, Navigate, useParams } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import AccessCTA from "../../components/resources/AccessCTA";
import Breadcrumbs from "../../components/resources/Breadcrumbs";
import LessonPreviewPanel from "../../components/resources/LessonPreviewPanel";
import StatusBadge from "../../components/resources/StatusBadge";
import {
  getLesson,
  getTopicBySlug,
  isValidFormat,
} from "../../data/resources";
import { FORMAT_LABELS } from "../../data/resources/types";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const LessonDetailPage: React.FC = () => {
  const { topicSlug, format, lessonSlug } = useParams<{
    topicSlug: string;
    format: string;
    lessonSlug: string;
  }>();

  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;
  const validFormat = format && isValidFormat(format) ? format : null;
  const lesson =
    topicSlug && validFormat && lessonSlug
      ? getLesson(topicSlug, validFormat, lessonSlug)
      : undefined;

  useDocumentTitle(lesson?.title ?? "Lesson");

  if (!topic || !validFormat || !lesson || topic.status !== "available") {
    return <Navigate to="/resources" replace />;
  }

  const formatLabel = FORMAT_LABELS[validFormat];
  const collectionPath = `/resources/${topic.slug}/${validFormat}`;

  return (
    <SiteLayout mode="resources">
      <main className="resources-main">
        <section className="section resources-section">
          <div className="page-container lesson-detail">
            <Breadcrumbs
              items={[
                { label: "Resources", to: "/resources" },
                { label: topic.title, to: `/resources/${topic.slug}` },
                { label: formatLabel, to: collectionPath },
                { label: lesson.title },
              ]}
            />

            <div className="lesson-detail-header">
              <span className="lesson-number-badge">
                Lesson {lesson.lessonNumber}
              </span>
              <StatusBadge variant={validFormat} />
            </div>

            <h1 className="section-title lesson-detail-title">{lesson.title}</h1>
            <p className="body-copy">{lesson.description}</p>

            <LessonPreviewPanel
              format={validFormat}
              title={lesson.title}
              thumbnailAsset={lesson.thumbnailAsset}
            />

            <div className="lesson-detail-includes">
              <h2 className="resources-subheading">What&apos;s included</h2>
              <ul className="card-list">
                {lesson.includedItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <AccessCTA
              lesson={lesson}
              collectionTitle={topic.title}
              collectionPath={`/resources/${topic.slug}`}
            />

            <Link to={collectionPath} className="lesson-detail-back">
              ← Back to {formatLabel.toLowerCase()}
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default LessonDetailPage;
