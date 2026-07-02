import type { LessonResource } from "../data/resources/types";

interface DownloadResponse {
  downloadUrl?: string;
  error?: string;
}

export async function requestResourceDownloadUrl(
  lesson: LessonResource,
  accessToken: string
): Promise<string> {
  const response = await fetch("/api/resource-download", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: lesson.downloadFileName,
      storageKey: lesson.storageKey,
      topicSlug: lesson.topicSlug,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as DownloadResponse;

  if (!response.ok || !payload.downloadUrl) {
    throw new Error(payload.error ?? "Unable to create a download link.");
  }

  return payload.downloadUrl;
}
