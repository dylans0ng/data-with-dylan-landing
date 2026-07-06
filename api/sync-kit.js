import {
  defaultConvertKitV3ApiBaseUrl,
  defaultKitV4ApiBaseUrl,
  normalizeTagId,
  subscribeConvertKitV3Tag,
  syncKitSubscriberV4,
} from "./_kit.js";

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

  try {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const authApiKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const kitApiKey = process.env.KIT_API_KEY;
  const kitApiSecret = process.env.KIT_API_SECRET;
  const kitTagId = normalizeTagId(
    process.env.KIT_PYTHON_BASICS_TAG_ID ??
      process.env.VITE_CONVERTKIT_PYTHON_TAG_ID
  );
  const kitV3ApiBaseUrl =
    process.env.KIT_API_BASE_URL ?? defaultConvertKitV3ApiBaseUrl;
  const kitV4ApiBaseUrl =
    process.env.KIT_V4_API_BASE_URL ?? defaultKitV4ApiBaseUrl;

  if (!supabaseUrl || !authApiKey) {
    json(res, 500, {
      error: "Supabase sync environment is missing.",
      missing: {
        supabaseUrl: !supabaseUrl,
        authApiKey: !authApiKey,
      },
    });
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

  if (!kitTagId || (!kitApiKey && !kitApiSecret)) {
    json(res, 200, {
      skipped: true,
      synced: false,
      missing: {
        kitTagId: !kitTagId,
        kitApiKey: !kitApiKey,
        kitApiSecret: !kitApiSecret,
      },
    });
    return;
  }

  const result = kitApiKey
    ? await syncKitSubscriberV4({
        apiBaseUrl: kitV4ApiBaseUrl,
        apiKey: kitApiKey,
        email: user.email,
        tagIds: [kitTagId],
      })
    : await subscribeConvertKitV3Tag({
        apiBaseUrl: kitV3ApiBaseUrl,
        apiSecret: kitApiSecret,
        email: user.email,
        tagId: kitTagId,
      });

  json(res, result.statusCode, result.body);
  } catch (error) {
    console.error("[Kit] Unexpected subscriber sync error.", error);
    json(res, 500, {
      error: "Unexpected Kit subscriber sync error.",
      message: error instanceof Error ? error.message : "Unknown error.",
    });
  }
}
