const allowedTopicSlugs = new Set(["python-fundamentals"]);

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function encodeStoragePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function getFileName(storageKey, requestedFileName) {
  if (requestedFileName && typeof requestedFileName === "string") {
    return requestedFileName;
  }

  return storageKey.split("/").at(-1) ?? "resource.pdf";
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

async function getSupabaseUser(supabaseUrl, apiKey, accessToken) {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed." });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const authApiKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    serviceRoleKey;
  const bucket = process.env.SUPABASE_RESOURCE_BUCKET ?? "resources";

  if (!supabaseUrl || !serviceRoleKey || !authApiKey) {
    json(res, 500, { error: "Supabase download environment is missing." });
    return;
  }

  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!accessToken) {
    json(res, 401, { error: "You need to log in before downloading." });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    json(res, 400, { error: "Invalid download request." });
    return;
  }

  const storageKey =
    typeof payload.storageKey === "string" ? payload.storageKey : "";
  const topicSlug = typeof payload.topicSlug === "string" ? payload.topicSlug : "";

  if (
    !allowedTopicSlugs.has(topicSlug) ||
    !storageKey.startsWith(`${topicSlug}/`) ||
    !storageKey.endsWith(".pdf")
  ) {
    json(res, 403, { error: "That resource is not available for download." });
    return;
  }

  const user = await getSupabaseUser(supabaseUrl, authApiKey, accessToken);
  if (!user) {
    json(res, 401, { error: "Your session expired. Please log in again." });
    return;
  }

  const signUrl = `${supabaseUrl}/storage/v1/object/sign/${bucket}/${encodeStoragePath(
    storageKey
  )}`;
  const fileName = getFileName(storageKey, payload.fileName);

  const response = await fetch(signUrl, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      download: fileName,
      expiresIn: 60,
    }),
  });

  const signedPayload = await response.json().catch(() => ({}));

  if (!response.ok || !signedPayload.signedURL) {
    json(res, 502, { error: "Unable to create a download link." });
    return;
  }

  const downloadUrl = signedPayload.signedURL.startsWith("http")
    ? signedPayload.signedURL
    : `${supabaseUrl}/storage/v1${signedPayload.signedURL}`;

  json(res, 200, { downloadUrl });
}
