import { aiWithPythonLessons } from "./ai-with-python-for-beginners";
import { pandasFundamentalsLessons } from "./pandas-fundamentals-crash-course";
import { pythonFundamentalsLessons } from "./python-fundamentals";
import { sqlFundamentalsLessons } from "./sql-fundamentals";
import { topics } from "./topics";
import type { LessonResource, ResourceFormat, Topic } from "./types";

const allLessons: LessonResource[] = [
  ...pythonFundamentalsLessons,
  ...pandasFundamentalsLessons,
  ...aiWithPythonLessons,
  ...sqlFundamentalsLessons,
];

export function getAllTopics(): Topic[] {
  return [...topics].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export function getAvailableTopics(): Topic[] {
  return getAllTopics().filter((topic) => topic.status === "available");
}

export function getComingSoonTopics(): Topic[] {
  return getAllTopics().filter((topic) => topic.status === "coming_soon");
}

export function getLessonsByTopicAndFormat(
  topicSlug: string,
  format: ResourceFormat
): LessonResource[] {
  return allLessons
    .filter(
      (lesson) =>
        lesson.topicSlug === topicSlug &&
        lesson.format === format &&
        lesson.availability === "published"
    )
    .sort((a, b) => a.lessonNumber - b.lessonNumber);
}

export function getPlannedLessonsByTopicAndFormat(
  topicSlug: string,
  format: ResourceFormat
): LessonResource[] {
  return allLessons
    .filter(
      (lesson) =>
        lesson.topicSlug === topicSlug &&
        lesson.format === format &&
        lesson.availability === "coming_soon"
    )
    .sort((a, b) => a.lessonNumber - b.lessonNumber);
}

export function getPublishedLessonCountByTopicAndFormat(
  topicSlug: string,
  format: ResourceFormat
): number {
  return getLessonsByTopicAndFormat(topicSlug, format).length;
}

export function getPlannedLessonCountByTopicAndFormat(
  topicSlug: string,
  format: ResourceFormat
): number {
  return getPlannedLessonsByTopicAndFormat(topicSlug, format).length;
}

export function getPublishedFormatsByTopic(
  topicSlug: string,
  formats: ResourceFormat[]
): ResourceFormat[] {
  return formats.filter(
    (format) => getPublishedLessonCountByTopicAndFormat(topicSlug, format) > 0
  );
}

export function getLesson(
  topicSlug: string,
  format: ResourceFormat,
  lessonSlug: string
): LessonResource | undefined {
  return allLessons.find(
    (lesson) =>
      lesson.topicSlug === topicSlug &&
      lesson.format === format &&
      lesson.slug === lessonSlug
  );
}

export function isValidFormat(value: string): value is ResourceFormat {
  return value === "cheat-sheets" || value === "guided-notes";
}
