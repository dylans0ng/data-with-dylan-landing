import type { LessonResource } from "./types";

import cheatSheetVariables from "../../assets/resources/python-fundamentals/cheat-sheets/Python_Variables_Data_Types_Cheat_Sheet.pdf?url";
import cheatSheetConditionals from "../../assets/resources/python-fundamentals/cheat-sheets/Python_Conditional_Logic_Cheat_Sheet.pdf?url";
import cheatSheetLoops from "../../assets/resources/python-fundamentals/cheat-sheets/Python_For_While_Loops_Cheat_Sheet.pdf?url";
import cheatSheetCollections from "../../assets/resources/python-fundamentals/cheat-sheets/Python_Lists_Sets_Tuples_Cheat_Sheet.pdf?url";
import cheatSheetDictionaries from "../../assets/resources/python-fundamentals/cheat-sheets/Python_Dictionaries_Cheat_Sheet.pdf?url";
import cheatSheetFileIo from "../../assets/resources/python-fundamentals/cheat-sheets/Python_File_IO_Cheat_Sheet.pdf?url";
import cheatSheetPandas from "../../assets/resources/python-fundamentals/cheat-sheets/Python_Dictionaries_to_Pandas_DataFrames_Cheat_Sheet.pdf?url";

import guidedNotesVariables from "../../assets/resources/python-fundamentals/guided-notes/Python_Variables_Guided_Notes.pdf?url";
import guidedNotesConditionals from "../../assets/resources/python-fundamentals/guided-notes/Python_Conditional_Logic_Guided_Notes.pdf?url";
import guidedNotesLoops from "../../assets/resources/python-fundamentals/guided-notes/Python_For_While_Loops_Guided_Notes.pdf?url";
import guidedNotesCollections from "../../assets/resources/python-fundamentals/guided-notes/Python_Lists_Sets_Tuples_Guided_Notes.pdf?url";
import guidedNotesDictionaries from "../../assets/resources/python-fundamentals/guided-notes/Python_Dictionaries_Guided_Notes.pdf?url";
import guidedNotesFileIo from "../../assets/resources/python-fundamentals/guided-notes/Python_File_IO_Guided_Notes.pdf?url";
import guidedNotesPandas from "../../assets/resources/python-fundamentals/guided-notes/Python_Pandas_DataFrames_Guided_Notes.pdf?url";

const TOPIC_SLUG = "python-fundamentals";

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
      "Store and retrieve data with key-value pairs—the workhorse of Python data structures.",
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

const cheatSheetAssets = [
  cheatSheetVariables,
  cheatSheetConditionals,
  cheatSheetLoops,
  cheatSheetCollections,
  cheatSheetDictionaries,
  cheatSheetFileIo,
  cheatSheetPandas,
];

const guidedNotesAssets = [
  guidedNotesVariables,
  guidedNotesConditionals,
  guidedNotesLoops,
  guidedNotesCollections,
  guidedNotesDictionaries,
  guidedNotesFileIo,
  guidedNotesPandas,
];

function buildLessons(
  format: "cheat-sheets" | "guided-notes",
  assets: string[]
): LessonResource[] {
  return lessonMeta.map((lesson, index) => ({
    id: `${TOPIC_SLUG}-${format}-${lesson.slug}`,
    lessonNumber: lesson.lessonNumber,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    topicSlug: TOPIC_SLUG,
    format,
    pdfAsset: assets[index],
    availability: "published" as const,
    accessLevel: "preview" as const,
    includedItems: [...lesson.includedItems],
  }));
}

export const pythonFundamentalsLessons: LessonResource[] = [
  ...buildLessons("cheat-sheets", cheatSheetAssets),
  ...buildLessons("guided-notes", guidedNotesAssets),
];
