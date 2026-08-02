import type { LessonResource } from "./types";

import filterDataCheatSheetPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/cheat-sheets/How_to_Filter_Data_in_Pandas_Cheat_Sheet.png";
import exploreDataframesCheatSheetPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/cheat-sheets/How_to_Explore_Dataframes_Cheat_Sheet.png";
import loadFilesCheatSheetPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/cheat-sheets/How_to_Load_Files_in_Pandas_Cheat_Sheet.png";
import selectRowsAndColumnsCheatSheetPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/cheat-sheets/Selecting_Rows_and_Columns_in_Pandas_Cheat_Sheet.png";
import filterDataGuidedNotesPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/guided-notes/How_to_Filter_Data_in_Pandas_Guided_Notes.png";
import exploreDataframesGuidedNotesPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/guided-notes/How_to_Explore_Dataframes_Pandas_Guided_Notes.png";
import loadFilesGuidedNotesPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/guided-notes/How_to_Load_Files_in_Pandas_Guided_Notes.png";
import selectRowsAndColumnsGuidedNotesPreview from "../../assets/resources/pandas-fundamentals-crash-course/previews/guided-notes/Selecting_Rows_and_Columns_Guided_Notes.png";

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
  {
    lessonNumber: 3,
    slug: "how-to-select-rows-and-columns",
    title: "How to Select Rows and Columns",
    description:
      "Learn how to select columns and rows by label or position, compare Series and DataFrame outputs, slice with .loc[] and .iloc[], and introduce Boolean masking.",
  },
  {
    lessonNumber: 4,
    slug: "how-to-filter-data",
    title: "How to Filter Data",
    description:
      "Learn how Boolean masks filter DataFrames, combine conditions with Pandas operators, reverse conditions, and save filtered results without changing the original data.",
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
  "how-to-select-rows-and-columns": {
    "cheat-sheets": {
      sourceFileName: "Selecting_Rows_and_Columns_in_Pandas_Cheat_Sheet.pdf",
      previewAsset: selectRowsAndColumnsCheatSheetPreview,
      includedItems: [
        "Single- and multiple-column selection",
        "Series versus DataFrame return types",
        "Label-based selection with .loc[]",
        "Position-based selection with .iloc[]",
        "Inclusive and exclusive slicing with Boolean masking",
      ],
    },
    "guided-notes": {
      sourceFileName: "Selecting_Rows_and_Columns_Guided_Notes.pdf",
      previewAsset: selectRowsAndColumnsGuidedNotesPreview,
      includedItems: [
        "Column-selection and return-type exercises",
        "Label-based .loc[] practice",
        "Position-based .iloc[] practice",
        "Row-and-column slicing comparisons",
        "Boolean masking, recap questions, and a practice challenge",
      ],
    },
  },
  "how-to-filter-data": {
    "cheat-sheets": {
      sourceFileName: "How_to_Filter_Data_in_Pandas_Cheat_Sheet.pdf",
      previewAsset: filterDataCheatSheetPreview,
      includedItems: [
        "Boolean masks and True/False row selection",
        "Single-condition filtering",
        "Combining filters with & and |",
        "Reversing conditions with ~",
        "Parentheses, saved results, and common mistakes",
      ],
    },
    "guided-notes": {
      sourceFileName: "How_to_Filter_Data_in_Pandas_Guided_Notes.pdf",
      previewAsset: filterDataGuidedNotesPreview,
      includedItems: [
        "Boolean-masking foundations",
        "Single- and multiple-condition filtering exercises",
        "AND, OR, and reverse-condition practice",
        "Saving and comparing filtered DataFrames",
        "Syntax corrections, recap questions, and a practice challenge",
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
