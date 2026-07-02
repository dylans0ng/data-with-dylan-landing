function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
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
  const authApiKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  const kitApiSecret = process.env.KIT_API_SECRET;
  const kitTagId = process.env.KIT_PYTHON_BASICS_TAG_ID;
  const kitApiBaseUrl =
    process.env.KIT_API_BASE_URL ?? "https://api.convertkit.com/v3";

  if (!supabaseUrl || !authApiKey) {
    json(res, 500, { error: "Supabase sync environment is missing." });
    return;
  }

  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!accessToken) {
    json(res, 401, { error: "You need to log in before syncing." });
    return;
  }

  const user = await getSupabaseUser(supabaseUrl, authApiKey, accessToken);
  if (!user?.email) {
    json(res, 401, { error: "Your session expired. Please log in again." });
    return;
  }

  if (!kitApiSecret || !kitTagId) {
    json(res, 200, { skipped: true, synced: false });
    return;
  }

  const response = await fetch(`${kitApiBaseUrl}/tags/${kitTagId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_secret: kitApiSecret,
      email: user.email,
      fields: {
        resource_topic: "python-fundamentals",
        source: "data-with-dylan-resources",
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    json(res, 502, {
      error: "Unable to sync the subscriber to Kit.",
      kitResponse: payload,
    });
    return;
  }

  json(res, 200, { synced: true });
}
