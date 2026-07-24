import type { LessonResource } from "./types";

import exploreDataframesCheatSheetPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/cheat-sheets/How_to_Explore_Dataframes_Cheat_Sheet.png";
import loadFilesCheatSheetPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/cheat-sheets/How_to_Load_Files_in_Pandas_Cheat_Sheet.png";
import exploreDataframesGuidedNotesPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/guided-notes/How_to_Explore_Dataframes_Pandas_Guided_Notes.png";
import loadFilesGuidedNotesPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/guided-notes/How_to_Load_Files_in_Pandas_Guided_Notes.png";

const TOPIC_SLUG = "pandas-fundamentals-crash-course";

const lessonMeta = [
  {
    lessonNumber: 1,
    slug: "how-to-load-files",
    title: "How to Load Files",
    description:
      "Learn how to import Pandas, understand DataFrames and Series, load CSV and Excel files, and inspect the resulting data.",
  },
  {
    lessonNumber: 2,
    slug: "how-to-explore-dataframes",
    title: "How to Explore Dataframes",
    description:
      "Learn how to inspect a DataFrame's structure, preview rows, summarize numerical data, identify missing values, and profile categorical columns.",
  },
] as const;

const resourceMeta = {
  "how-to-load-files": {
    "cheat-sheets": {
      sourceFileName: "How_to_Load_Files_in_Pandas_Cheat_Sheet.pdf",
      previewAsset: loadFilesCheatSheetPreview,
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
      previewAsset: loadFilesGuidedNotesPreview,
      includedItems: [
        "Importing Pandas with the pd alias",
        "Guided DataFrame and Series definitions",
        "File-loading syntax practice",
        "Fill-in checkpoints and writing prompts",
        "A practical review exercise",
      ],
    },
  },
  "how-to-explore-dataframes": {
    "cheat-sheets": {
      sourceFileName: "How_to_Explore_Dataframes_Cheat_Sheet.pdf",
      previewAsset: exploreDataframesCheatSheetPreview,
      includedItems: [
        "Previewing rows with head() and tail()",
        "Reviewing shape, column names, data types, and summary statistics",
        "Identifying, counting, and removing missing values",
        "Counting unique values and category frequencies",
        "Common beginner mistakes and a practical review exercise",
      ],
    },
    "guided-notes": {
      sourceFileName: "How_to_Explore_Dataframes_Pandas_Guided_Notes.pdf",
      previewAsset: exploreDataframesGuidedNotesPreview,
      includedItems: [
        "A structured DataFrame exploration workflow",
        "Method-versus-attribute practice",
        "Diagnostic and numerical summary exercises",
        "Missing-value checks and cleanup",
        "Categorical profiling, recap questions, and a practice challenge",
      ],
    },
  },
} as const;

export const pandasFundamentalsLessons: LessonResource[] = lessonMeta.flatMap(
  (lesson) =>
    Object.entries(resourceMeta[lesson.slug]).map(([format, resource]) => ({
      id: `${TOPIC_SLUG}-${format}-${lesson.slug}`,
      lessonNumber: lesson.lessonNumber,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      topicSlug: TOPIC_SLUG,
      format: format as LessonResource["format"],
      sourceFileName: resource.sourceFileName,
      downloadFileName: resource.sourceFileName,
      storageKey: `${TOPIC_SLUG}/${format}/${resource.sourceFileName}`,
      thumbnailAsset: resource.previewAsset,
      availability: "published",
      accessLevel: "account_required",
      includedItems: [...resource.includedItems],
    }))
);
