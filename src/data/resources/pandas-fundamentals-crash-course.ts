import type { LessonResource } from "./types";

import cheatSheetPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/cheat-sheets/How_to_Load_Files_in_Pandas_Cheat_Sheet.png";
import guidedNotesPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/guided-notes/How_to_Load_Files_in_Pandas_Guided_Notes.png";

const TOPIC_SLUG = "pandas-fundamentals-crash-course";
const LESSON_SLUG = "how-to-load-files";

const lessonMeta = {
  lessonNumber: 1,
  slug: LESSON_SLUG,
  title: "How to Load Files",
  description:
    "Learn how to import Pandas, understand DataFrames and Series, load CSV and Excel files, and inspect the resulting data.",
} as const;

const resourceMeta = {
  "cheat-sheets": {
    sourceFileName: "How_to_Load_Files_in_Pandas_Cheat_Sheet.pdf",
    previewAsset: cheatSheetPreview,
    includedItems: [
      "DataFrames compared with Series",
      "Creating a DataFrame from a dictionary",
      "Loading CSV and Excel files",
      "Inspecting data with shape and head()",
      "File paths, worksheet names, and common beginner mistakes",
    ],
  },
  "guided-notes": {
    sourceFileName: "How_to_Load_Files_in_Pandas_Guided_Notes.pdf",
    previewAsset: guidedNotesPreview,
    includedItems: [
      "Importing Pandas with the pd alias",
      "Guided DataFrame and Series definitions",
      "File-loading syntax practice",
      "Fill-in checkpoints and writing prompts",
      "A practical review exercise",
    ],
  },
} as const;

export const pandasFundamentalsLessons: LessonResource[] = Object.entries(
  resourceMeta
).map(([format, resource]) => ({
  id: `${TOPIC_SLUG}-${format}-${LESSON_SLUG}`,
  lessonNumber: lessonMeta.lessonNumber,
  slug: lessonMeta.slug,
  title: lessonMeta.title,
  description: lessonMeta.description,
  topicSlug: TOPIC_SLUG,
  format: format as LessonResource["format"],
  sourceFileName: resource.sourceFileName,
  downloadFileName: resource.sourceFileName,
  storageKey: `${TOPIC_SLUG}/${format}/${resource.sourceFileName}`,
  thumbnailAsset: resource.previewAsset,
  availability: "published",
  accessLevel: "account_required",
  includedItems: [...resource.includedItems],
}));
