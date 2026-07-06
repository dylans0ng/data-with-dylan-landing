import {
  defaultConvertKitV3ApiBaseUrl,
  defaultKitV4ApiBaseUrl,
  normalizeTagId,
  subscribeConvertKitV3Form,
  syncKitSubscriberV4,
} from "./_kit.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
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

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeFirstName(value) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed." });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    json(res, 400, { error: "Invalid subscription request." });
    return;
  }

  const email = normalizeEmail(payload.email);
  const firstName = normalizeFirstName(payload.firstName);
  const wantsPython = payload.interests?.python === true;
  const wantsSql = payload.interests?.sql === true;

  if (!emailRegex.test(email)) {
    json(res, 400, { error: "A valid email address is required." });
    return;
  }

  if (!wantsPython && !wantsSql) {
    json(res, 400, { error: "Select at least one topic." });
    return;
  }

  const pythonTagId = normalizeTagId(
    process.env.KIT_PYTHON_BASICS_TAG_ID ??
      process.env.VITE_CONVERTKIT_PYTHON_TAG_ID
  );
  const sqlTagId = normalizeTagId(
    process.env.KIT_SQL_TAG_ID ?? process.env.VITE_CONVERTKIT_SQL_TAG_ID
  );

  if (wantsPython && !pythonTagId) {
    json(res, 500, { error: "Python Kit tag environment is missing." });
    return;
  }

  if (wantsSql && !sqlTagId) {
    json(res, 500, { error: "SQL Kit tag environment is missing." });
    return;
  }

  const selectedTagIds = [
    ...(wantsPython ? [pythonTagId] : []),
    ...(wantsSql ? [sqlTagId] : []),
  ];

  const kitApiKey = process.env.KIT_API_KEY;
  const formId = normalizeTagId(
    process.env.KIT_FORM_ID ?? process.env.VITE_CONVERTKIT_FORM_ID
  );

  const result = kitApiKey
    ? await syncKitSubscriberV4({
        apiBaseUrl: process.env.KIT_V4_API_BASE_URL ?? defaultKitV4ApiBaseUrl,
        apiKey: kitApiKey,
        email,
        firstName,
        tagIds: selectedTagIds,
        formId,
      })
    : await subscribeConvertKitV3Form({
        apiBaseUrl: process.env.KIT_API_BASE_URL ?? defaultConvertKitV3ApiBaseUrl,
        apiKey: process.env.VITE_CONVERTKIT_API_KEY,
        formId,
        email,
        firstName,
        tagIds: selectedTagIds,
      });

  json(res, result.statusCode, result.body);
}
