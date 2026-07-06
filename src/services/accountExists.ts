export const ACCOUNT_EXISTS_ERROR_MESSAGE =
  "An account already exists for this email. Please log in instead.";

interface AccountExistsResponse {
  exists?: boolean;
  error?: string;
}

export async function checkAccountExists(email: string): Promise<boolean> {
  const response = await fetch("/api/account-exists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const payload = (await response
    .json()
    .catch(() => ({}))) as AccountExistsResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to check account availability.");
  }

  return Boolean(payload.exists);
}
