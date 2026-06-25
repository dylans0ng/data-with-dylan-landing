export type TopicStatus = "available" | "coming_soon";

export type ResourceFormat = "cheat-sheets" | "guided-notes";

export type LessonAvailability = "published" | "coming_soon";

export type AccessLevel = "preview" | "account_required";

export interface Topic {
  slug: string;
  title: string;
  status: TopicStatus;
  sortOrder: number;
  icon: string;
  shortDescription: string;
  overviewDescription: string;
  playlistUrl?: string;
  formats: ResourceFormat[];
  lessonCount: number;
}

export interface LessonResource {
  id: string;
  lessonNumber: number;
  slug: string;
  title: string;
  description: string;
  topicSlug: string;
  format: ResourceFormat;
  pdfAsset: string;
  thumbnailAsset?: string;
  videoUrl?: string;
  availability: LessonAvailability;
  accessLevel: AccessLevel;
  includedItems: string[];
}

export const FORMAT_LABELS: Record<ResourceFormat, string> = {
  "cheat-sheets": "Cheat Sheets",
  "guided-notes": "Guided Notes",
};

export const FORMAT_DESCRIPTIONS: Record<ResourceFormat, string> = {
  "cheat-sheets":
    "Quick-reference summaries of each lesson—perfect for review before practice or interviews.",
  "guided-notes":
    "Fill-in practice worksheets that walk you through examples step by step alongside the videos.",
};
