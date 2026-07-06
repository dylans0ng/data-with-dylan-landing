import SiteLayout from "../../components/layout/SiteLayout";
import ComingSoonCard from "../../components/resources/ComingSoonCard";
import TopicCard from "../../components/resources/TopicCard";
import { getAllTopics } from "../../data/resources";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const ResourcesIndexPage: React.FC = () => {
  useDocumentTitle("Resources");

  const topics = getAllTopics();

  return (
    <SiteLayout mode="resources">
      <main className="resources-main">
        <section className="section resources-section">
          <div className="page-container">
            <p className="eyebrow">RESOURCES</p>
            <h1 className="section-title">Browse learning collections</h1>
            <p className="body-copy resources-intro">
              Free companion materials for Data with Dylan YouTube lessons—cheat
              sheets and guided notes designed to reinforce what you watch.
            </p>

            <div className="cards-grid resources-topic-grid">
              {topics.map((topic) =>
                topic.status === "available" || topic.status === "partial" ? (
                  <TopicCard key={topic.slug} topic={topic} />
                ) : (
                  <ComingSoonCard key={topic.slug} topic={topic} />
                )
              )}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
};

export default ResourcesIndexPage;
