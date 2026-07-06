import { Navigate, useParams } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import Breadcrumbs from "../../components/resources/Breadcrumbs";
import ComingSoonResourceCard from "../../components/resources/ComingSoonResourceCard";
import FormatToggle from "../../components/resources/FormatToggle";
import LessonCard from "../../components/resources/LessonCard";
import TopicEyebrow from "../../components/resources/TopicEyebrow";
import {
  getLessonsByTopicAndFormat,
  getPlannedLessonsByTopicAndFormat,
  getPublishedFormatsByTopic,
  getTopicBySlug,
  isValidFormat,
} from "../../data/resources";
import { FORMAT_LABELS } from "../../data/resources/types";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const LessonCollectionPage: React.FC = () => {
  const { topicSlug, format } = useParams<{
    topicSlug: string;
    format: string;
  }>();

  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;
  const validFormat = format && isValidFormat(format) ? format : null;
  const lessons =
    topicSlug && validFormat
      ? getLessonsByTopicAndFormat(topicSlug, validFormat)
      : [];
  const plannedLessons =
    topicSlug && validFormat
      ? getPlannedLessonsByTopicAndFormat(topicSlug, validFormat)
      : [];
  const publishedFormats = topic
    ? getPublishedFormatsByTopic(topic.slug, topic.formats)
    : [];

  const formatLabel = validFormat ? FORMAT_LABELS[validFormat] : "Collection";
  const resourceCount = lessons.length || plannedLessons.length;
  const resourceLabel = resourceCount === 1 ? "resource" : "resources";

  useDocumentTitle(topic ? `${topic.title} ${formatLabel}` : "Collection");

  if (
    !topic ||
    !validFormat ||
    topic.status === "coming_soon" ||
    !topic.formats.includes(validFormat)
  ) {
    return <Navigate to="/resources" replace />;
  }

  return (
    <SiteLayout mode="resources">
      <main className="resources-main">
        <section className="section resources-section">
          <div className="page-container">
            <Breadcrumbs
              items={[
                { label: "Resources", to: "/resources" },
                { label: topic.title, to: `/resources/${topic.slug}` },
                { label: formatLabel },
              ]}
            />

            <TopicEyebrow topic={topic} />
            <h1 className="section-title">{formatLabel}</h1>
            <p className="body-copy resources-intro">
              {lessons.length > 0
                ? `${lessons.length} ${resourceLabel} published. Browse each resource below.`
                : `${resourceCount} planned ${resourceLabel}. These resources are not published yet.`}
            </p>

            {publishedFormats.length > 1 && lessons.length > 0 && (
              <FormatToggle
                topicSlug={topic.slug}
                activeFormat={validFormat}
                formats={publishedFormats}
              />
            )}

            {lessons.length > 0 ? (
              <div className="lesson-list">
                {lessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : plannedLessons.length > 0 ? (
              <div className="lesson-list">
                {plannedLessons.map((lesson) => (
                  <ComingSoonResourceCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <div className="empty-collection-state">
                <h2>No resources published yet</h2>
                <p>
                  This format is planned for {topic.title}, but no lessons are
                  published here yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default LessonCollectionPage;
