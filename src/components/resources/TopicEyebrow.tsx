import type { Topic } from "../../data/resources/types";

interface TopicEyebrowProps {
  topic: Topic;
}

const TopicEyebrow: React.FC<TopicEyebrowProps> = ({ topic }) => {
  return (
    <p className="eyebrow">
      {topic.iconAsset ? (
        <img
          src={topic.iconAsset}
          alt=""
          className={`eyebrow-icon-image${
            topic.slug === "sql-fundamentals" ? " eyebrow-icon-image--sql" : ""
          }`}
          aria-hidden="true"
        />
      ) : (
        topic.icon
      )}{" "}
      {topic.title}
    </p>
  );
};

export default TopicEyebrow;
