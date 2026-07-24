export type TopicStatus = "available" | "partial" | "coming_soon";

export type ResourceFormat = "cheat-sheets" | "guided-notes";

export type LessonAvailability = "published" | "coming_soon";

export type AccessLevel =
  | "preview"
  | "account_required"
  | "protected_pending";

export interface Topic {
  slug: string;
  title: string;
  status: TopicStatus;
  sortOrder: number;
  icon: string;
  iconAsset?: string;
  shortDescription: string;
  overviewDescription: string;
  cardMetaText?: string;
  playlistUrl?: string;
  playlistComingSoon?: boolean;
  formats: ResourceFormat[];
  lessonCount: number;
  availableLessonCount?: number;
  mysteryLessonCount?: number;
  availableResourceCount?: number;
  comingSoonHeading?: string;
  comingSoonDescription?: string;
  formatIntroCopy?: string;
  formatComingSoonCopy?: Partial<Record<ResourceFormat, string>>;
  formatTeaserCopy?: string;
}

export interface LessonResource {
  id: string;
  lessonNumber: number;
  slug: string;
  title: string;
  description: string;
  topicSlug: string;
  format: ResourceFormat;
  storageKey?: string;
  plannedStorageKey?: string;
  sourceFileName?: string;
  downloadFileName?: string;
  thumbnailAsset?: string;
  videoUrl?: string;
  availability: LessonAvailability;
  accessLevel: AccessLevel;
  includedItems: string[];
  comingSoonCopy?: string;
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
