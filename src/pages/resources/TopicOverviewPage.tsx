import { Navigate, useParams } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import Breadcrumbs from "../../components/resources/Breadcrumbs";
import FormatChooserCard from "../../components/resources/FormatChooserCard";
import { getTopicBySlug } from "../../data/resources";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const TopicOverviewPage: React.FC = () => {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;

  useDocumentTitle(topic?.title ?? "Topic");

  if (!topic) {
    return <Navigate to="/resources" replace />;
  }

  if (topic.status === "coming_soon") {
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
                { label: topic.title },
              ]}
            />

            <p className="eyebrow">{topic.icon} {topic.title}</p>
            <h1 className="section-title">{topic.title}</h1>
            <p className="body-copy resources-intro">{topic.overviewDescription}</p>

            {topic.playlistUrl && (
              <p className="resources-playlist-link">
                <a
                  href={topic.playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  Watch on YouTube
                </a>
              </p>
            )}

            <h2 className="resources-subheading">Choose a format</h2>
            <p className="body-copy resources-format-intro">
              Each lesson includes two companion formats—pick the one that fits
              how you learn best.
            </p>

            <div className="cards-grid format-chooser-grid">
              {topic.formats.map((format) => (
                <FormatChooserCard
                  key={format}
                  topicSlug={topic.slug}
                  format={format}
                  lessonCount={topic.lessonCount}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default TopicOverviewPage;
