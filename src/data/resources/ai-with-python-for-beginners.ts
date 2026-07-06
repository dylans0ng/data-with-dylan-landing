import type { LessonResource } from "./types";

import cheatSheetPreview from "../../assets/resources/ai-with-python-for-beginners/previews/cheat-sheets/Call_Your_First_AI_Model_Cheat_Sheet.png";
import guidedNotesPreview from "../../assets/resources/ai-with-python-for-beginners/previews/guided-notes/Call_Your_First_AI_Model_in_Python_Guided_Notes.png";

const TOPIC_SLUG = "ai-with-python-for-beginners";
const LESSON_SLUG = "call-your-first-ai-model-in-python";

const lessonMeta = {
  lessonNumber: 1,
  slug: LESSON_SLUG,
  title: "Call Your First AI Model in Python",
  description:
    "Set up a Python environment, protect your API key, create an OpenAI client, send prompts, and build a simple AI-powered content idea tool.",
} as const;

const resourceMeta = {
  "cheat-sheets": {
    sourceFileName: "Call_Your_First_AI_Model_Cheat_Sheet.pdf",
    previewAsset: cheatSheetPreview,
    includedItems: [
      "Virtual environment setup",
      "Installing openai and python-dotenv",
      "Protecting API keys with .env and .gitignore",
      "Creating an OpenAI client",
      "Writing system and user prompts",
      "Accessing generated response text",
    ],
  },
  "guided-notes": {
    sourceFileName: "Call_Your_First_AI_Model_in_Python_Guided_Notes.pdf",
    previewAsset: guidedNotesPreview,
    includedItems: [
      "Environment setup checkpoints",
      "API key safety practice",
      "OpenAI client walkthrough",
      "System prompt and user prompt exercises",
      "Chat-completion response review",
      "Content idea tool build steps",
    ],
  },
} as const;

export const aiWithPythonLessons: LessonResource[] = Object.entries(
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
