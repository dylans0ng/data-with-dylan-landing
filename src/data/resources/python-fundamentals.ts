import type { LessonResource } from "./types";

import cheatSheetVariablesPreview from "../../assets/resources/python-fundamentals/previews/cheat-sheets/Python_Variables_Data_Types_Cheat_Sheet.png";
import cheatSheetConditionalsPreview from "../../assets/resources/python-fundamentals/previews/cheat-sheets/Python_Conditional_Logic_Cheat_Sheet.png";
import cheatSheetLoopsPreview from "../../assets/resources/python-fundamentals/previews/cheat-sheets/Python_For_While_Loops_Cheat_Sheet.png";
import cheatSheetCollectionsPreview from "../../assets/resources/python-fundamentals/previews/cheat-sheets/Python_Lists_Sets_Tuples_Cheat_Sheet.png";
import cheatSheetDictionariesPreview from "../../assets/resources/python-fundamentals/previews/cheat-sheets/Python_Dictionaries_Cheat_Sheet.png";
import cheatSheetFileIoPreview from "../../assets/resources/python-fundamentals/previews/cheat-sheets/Python_File_IO_Cheat_Sheet.png";
import cheatSheetPandasPreview from "../../assets/resources/python-fundamentals/previews/cheat-sheets/Python_Dictionaries_to_Pandas_DataFrames_Cheat_Sheet.png";

import guidedNotesVariablesPreview from "../../assets/resources/python-fundamentals/previews/guided-notes/Python_Variables_Guided_Notes.png";
import guidedNotesConditionalsPreview from "../../assets/resources/python-fundamentals/previews/guided-notes/Python_Conditional_Logic_Guided_Notes.png";
import guidedNotesLoopsPreview from "../../assets/resources/python-fundamentals/previews/guided-notes/Python_For_While_Loops_Guided_Notes.png";
import guidedNotesCollectionsPreview from "../../assets/resources/python-fundamentals/previews/guided-notes/Python_Lists_Sets_Tuples_Guided_Notes.png";
import guidedNotesDictionariesPreview from "../../assets/resources/python-fundamentals/previews/guided-notes/Python_Dictionaries_Guided_Notes.png";
import guidedNotesFileIoPreview from "../../assets/resources/python-fundamentals/previews/guided-notes/Python_File_IO_Guided_Notes.png";
import guidedNotesPandasPreview from "../../assets/resources/python-fundamentals/previews/guided-notes/Python_Pandas_DataFrames_Guided_Notes.png";

const TOPIC_SLUG = "python-fundamentals";
const CHEAT_SHEETS_PATH = `${TOPIC_SLUG}/cheat-sheets`;
const GUIDED_NOTES_PATH = `${TOPIC_SLUG}/guided-notes`;

const lessonMeta = [
  {
    lessonNumber: 1,
    slug: "variables-and-data-types",
    title: "Python Variables & Data Types",
    description:
      "Learn how to store values, understand basic data types, and write your first Python expressions.",
    includedItems: [
      "Variable assignment and naming",
      "Strings, integers, floats, and booleans",
      "Type checking with type()",
      "Basic arithmetic and string operations",
    ],
  },
  {
    lessonNumber: 2,
    slug: "conditional-logic",
    title: "Conditional Logic",
    description:
      "Control program flow with if, elif, and else statements to make decisions in your code.",
    includedItems: [
      "if / elif / else syntax",
      "Comparison and logical operators",
      "Nested conditionals",
      "Truthy and falsy values",
    ],
  },
  {
    lessonNumber: 3,
    slug: "for-while-loops",
    title: "For & While Loops",
    description:
      "Repeat actions efficiently with for and while loops, including iterating over sequences.",
    includedItems: [
      "for loops over ranges and collections",
      "while loops and loop conditions",
      "break and continue",
      "Common loop patterns",
    ],
  },
  {
    lessonNumber: 4,
    slug: "lists-sets-tuples",
    title: "Lists vs. Sets vs. Tuples",
    description:
      "Compare Python's core collection types and know when to use each one.",
    includedItems: [
      "Lists: ordered, mutable sequences",
      "Tuples: ordered, immutable sequences",
      "Sets: unordered collections of unique items",
      "Indexing, slicing, and basic methods",
    ],
  },
  {
    lessonNumber: 5,
    slug: "dictionaries",
    title: "Dictionaries",
    description:
      "Store and retrieve data with key-value pairs - the workhorse of Python data structures.",
    includedItems: [
      "Creating and accessing dictionaries",
      "Adding, updating, and removing keys",
      "Looping over keys, values, and items",
      "Common dictionary methods",
    ],
  },
  {
    lessonNumber: 6,
    slug: "file-io",
    title: "File I/O",
    description:
      "Read from and write to files so your programs can persist and process real data.",
    includedItems: [
      "Opening files with open()",
      "Reading and writing text files",
      "Using with statements for safe file handling",
      "Working with file paths",
    ],
  },
  {
    lessonNumber: 7,
    slug: "dictionaries-to-pandas-dataframe",
    title: "Convert a Dictionary into a Pandas DataFrame",
    description:
      "Bridge Python dictionaries and Pandas DataFrames to start working with tabular data.",
    includedItems: [
      "Installing and importing Pandas",
      "Creating a DataFrame from a dictionary",
      "Viewing and inspecting DataFrame structure",
      "Basic column and row access",
    ],
  },
] as const;

const cheatSheetFileNames = [
  "Python_Variables_Data_Types_Cheat_Sheet.pdf",
  "Python_Conditional_Logic_Cheat_Sheet.pdf",
  "Python_For_While_Loops_Cheat_Sheet.pdf",
  "Python_Lists_Sets_Tuples_Cheat_Sheet.pdf",
  "Python_Dictionaries_Cheat_Sheet.pdf",
  "Python_File_IO_Cheat_Sheet.pdf",
  "Python_Dictionaries_to_Pandas_DataFrames_Cheat_Sheet.pdf",
];

const cheatSheetPreviewAssets = [
  cheatSheetVariablesPreview,
  cheatSheetConditionalsPreview,
  cheatSheetLoopsPreview,
  cheatSheetCollectionsPreview,
  cheatSheetDictionariesPreview,
  cheatSheetFileIoPreview,
  cheatSheetPandasPreview,
];

const guidedNotesFileNames = [
  "Python_Variables_Guided_Notes.pdf",
  "Python_Conditional_Logic_Guided_Notes.pdf",
  "Python_For_While_Loops_Guided_Notes.pdf",
  "Python_Lists_Sets_Tuples_Guided_Notes.pdf",
  "Python_Dictionaries_Guided_Notes.pdf",
  "Python_File_IO_Guided_Notes.pdf",
  "Python_Pandas_DataFrames_Guided_Notes.pdf",
];

const guidedNotesPreviewAssets = [
  guidedNotesVariablesPreview,
  guidedNotesConditionalsPreview,
  guidedNotesLoopsPreview,
  guidedNotesCollectionsPreview,
  guidedNotesDictionariesPreview,
  guidedNotesFileIoPreview,
  guidedNotesPandasPreview,
];

function buildLessons(
  format: "cheat-sheets" | "guided-notes",
  fileNames: string[],
  previewAssets: string[]
): LessonResource[] {
  const storagePath =
    format === "cheat-sheets" ? CHEAT_SHEETS_PATH : GUIDED_NOTES_PATH;

  return lessonMeta.map((lesson, index) => ({
    id: `${TOPIC_SLUG}-${format}-${lesson.slug}`,
    lessonNumber: lesson.lessonNumber,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    topicSlug: TOPIC_SLUG,
    format,
    storageKey: `${storagePath}/${fileNames[index]}`,
    downloadFileName: fileNames[index],
    thumbnailAsset: previewAssets[index],
    availability: "published" as const,
    accessLevel: "account_required" as const,
    includedItems: [...lesson.includedItems],
  }));
}

export const pythonFundamentalsLessons: LessonResource[] = [
  ...buildLessons("cheat-sheets", cheatSheetFileNames, cheatSheetPreviewAssets),
  ...buildLessons("guided-notes", guidedNotesFileNames, guidedNotesPreviewAssets),
];
