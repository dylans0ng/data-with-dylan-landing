import { Navigate, useParams } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import Breadcrumbs from "../../components/resources/Breadcrumbs";
import FormatToggle from "../../components/resources/FormatToggle";
import LessonCard from "../../components/resources/LessonCard";
import { useAuth } from "../../auth/useAuth";
import {
  getLessonsByTopicAndFormat,
  getTopicBySlug,
  isValidFormat,
} from "../../data/resources";
import { FORMAT_LABELS } from "../../data/resources/types";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const LessonCollectionPage: React.FC = () => {
  const { user } = useAuth();
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

  const formatLabel = validFormat ? FORMAT_LABELS[validFormat] : "Collection";

  useDocumentTitle(
    topic ? `${topic.title} ${formatLabel}` : "Collection"
  );

  if (!topic || !validFormat || topic.status !== "available") {
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

            <p className="eyebrow">{topic.icon} {topic.title}</p>
            <h1 className="section-title">{formatLabel}</h1>
            <p className="body-copy resources-intro">
              {lessons.length} lessons in sequence—browse each resource below.
            </p>

            <div className="library-access-banner">
              {user ? (
                <p>
                  Your account unlocks every Python Fundamentals cheat sheet and
                  guided notes download.
                </p>
              ) : (
                <p>
                  Previews are public. Create a free account from any resource
                  page to unlock the full Python Fundamentals library.
                </p>
              )}
            </div>

            <FormatToggle topicSlug={topic.slug} activeFormat={validFormat} />

            <div className="lesson-list">
              {lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default LessonCollectionPage;
