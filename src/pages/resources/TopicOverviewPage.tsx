import { Navigate, useParams } from "react-router-dom";
import SiteLayout from "../../components/layout/SiteLayout";
import Breadcrumbs from "../../components/resources/Breadcrumbs";
import FormatChooserCard from "../../components/resources/FormatChooserCard";
import TopicEyebrow from "../../components/resources/TopicEyebrow";
import {
  getPlannedLessonCountByTopicAndFormat,
  getPublishedLessonCountByTopicAndFormat,
  getTopicBySlug,
} from "../../data/resources";
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

            <TopicEyebrow topic={topic} />
            <h1 className="section-title">{topic.title}</h1>
            <p className="body-copy resources-intro">{topic.overviewDescription}</p>

            {(topic.playlistUrl || topic.playlistComingSoon) && (
              <p className="resources-playlist-link">
                {topic.playlistUrl ? (
                  <a
                    href={topic.playlistUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                  >
                    Watch on YouTube
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled
                    aria-label="Watch on YouTube (coming soon)"
                  >
                    Watch on YouTube
                  </button>
                )}
              </p>
            )}

            <h2 className="resources-subheading">Choose a format</h2>
            <p className="body-copy resources-format-intro">
              {topic.status === "partial"
                ? topic.formatIntroCopy ??
                  "Start with the formats published now, and see what is planned next."
                : "Each lesson includes two supplemental formats - pick the one that fits how you learn best."}
            </p>

            <div className="cards-grid format-chooser-grid">
              {topic.formats.map((format) => (
                <FormatChooserCard
                  key={format}
                  topicSlug={topic.slug}
                  format={format}
                  publishedCount={getPublishedLessonCountByTopicAndFormat(
                    topic.slug,
                    format
                  )}
                  plannedCount={getPlannedLessonCountByTopicAndFormat(
                    topic.slug,
                    format
                  )}
                  comingSoonCopy={
                    topic.status === "partial"
                      ? topic.formatComingSoonCopy?.[format]
                      : undefined
                  }
                />
              ))}
            </div>

            {topic.status === "partial" && topic.comingSoonDescription && (
              <section className="future-resource-state">
                <h2 className="resources-subheading">
                  {topic.comingSoonHeading ?? "More resources are coming"}
                </h2>
                <p className="body-copy">{topic.comingSoonDescription}</p>
              </section>
            )}
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default TopicOverviewPage;
