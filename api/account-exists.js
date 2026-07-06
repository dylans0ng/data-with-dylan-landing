function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Cache-Control", "no-store");
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

async function fetchUsersPage(supabaseUrl, serviceRoleKey, page, perPage) {
  const url = new URL("/auth/v1/admin/users", supabaseUrl);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string"
        ? payload.error
        : "Unable to check Supabase accounts."
    );
  }

  return Array.isArray(payload.users) ? payload.users : [];
}

async function accountExists(supabaseUrl, serviceRoleKey, email) {
  const perPage = 1000;
  const maxPages = 100;

  for (let page = 1; page <= maxPages; page += 1) {
    const users = await fetchUsersPage(
      supabaseUrl,
      serviceRoleKey,
      page,
      perPage
    );

    if (
      users.some((user) => normalizeEmail(user?.email) === email)
    ) {
      return true;
    }

    if (users.length < perPage) {
      return false;
    }
  }

  throw new Error("Unable to check all Supabase accounts.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { error: "Method not allowed." });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    json(res, 500, { error: "Supabase account environment is missing." });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch {
    json(res, 400, { error: "Invalid account lookup request." });
    return;
  }

  const email = normalizeEmail(payload.email);

  if (!email || !email.includes("@")) {
    json(res, 400, { error: "A valid email address is required." });
    return;
  }

  try {
    json(res, 200, {
      exists: await accountExists(supabaseUrl, serviceRoleKey, email),
    });
  } catch {
    json(res, 502, { error: "Unable to check account availability." });
  }
}
