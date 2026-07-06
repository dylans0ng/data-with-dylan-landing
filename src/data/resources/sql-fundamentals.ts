import type { LessonResource } from "./types";

import sqlJoinsPreview from "../../assets/resources/sql-fundamentals/previews/cheat-sheets/SQL_Joins_Cheat_Sheet.png";

const TOPIC_SLUG = "sql-fundamentals";
const LESSON_SLUG = "sql-joins";
const CHEAT_SHEETS_PATH = `${TOPIC_SLUG}/cheat-sheets`;
const GUIDED_NOTES_PATH = `${TOPIC_SLUG}/guided-notes`;

const lessonMeta = {
  lessonNumber: 1,
  slug: LESSON_SLUG,
  title: "SQL Joins",
  description:
    "Compare INNER JOIN, LEFT JOIN, and RIGHT JOIN with example tables, practice questions, solutions, and quick join summaries.",
  includedItems: [
    "INNER JOIN, LEFT JOIN, and RIGHT JOIN patterns",
    "Example tables and query walkthroughs",
    "Practice questions with solutions",
    "Quick summaries for choosing the right join",
  ],
} as const;

export const sqlFundamentalsLessons: LessonResource[] = [
  {
    id: `${TOPIC_SLUG}-cheat-sheets-${LESSON_SLUG}`,
    lessonNumber: lessonMeta.lessonNumber,
    slug: lessonMeta.slug,
    title: lessonMeta.title,
    description: lessonMeta.description,
    topicSlug: TOPIC_SLUG,
    format: "cheat-sheets",
    storageKey: `${CHEAT_SHEETS_PATH}/SQL_Joins_Cheat_Sheet.pdf`,
    sourceFileName: "SQL_Joins_Cheat_Sheet.pdf",
    downloadFileName: "SQL_Joins_Cheat_Sheet.pdf",
    thumbnailAsset: sqlJoinsPreview,
    availability: "published",
    accessLevel: "account_required",
    includedItems: [...lessonMeta.includedItems],
  },
  {
    id: `${TOPIC_SLUG}-guided-notes-${LESSON_SLUG}`,
    lessonNumber: lessonMeta.lessonNumber,
    slug: lessonMeta.slug,
    title: "SQL Joins Guided Notes",
    description:
      "Step-by-step SQL joins notes are planned, but not published yet.",
    topicSlug: TOPIC_SLUG,
    format: "guided-notes",
    plannedStorageKey: `${GUIDED_NOTES_PATH}/SQL_Joins_Guided_Notes.pdf`,
    sourceFileName: "SQL_Joins_Guided_Notes.pdf",
    downloadFileName: "SQL_Joins_Guided_Notes.pdf",
    availability: "coming_soon",
    accessLevel: "protected_pending",
    includedItems: [...lessonMeta.includedItems],
    comingSoonCopy:
      "Step-by-step SQL joins notes are planned, but not published yet.",
  },
];
