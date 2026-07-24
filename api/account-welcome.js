import {
  accountWelcomeTemplateVersion,
  buildAccountWelcomeEmail,
} from "./_accountWelcome.js";

const resendApiUrl = "https://api.resend.com/emails";
const maxAttempts = 3;
const resendIdempotencyWindowMs = 24 * 60 * 60 * 1000;

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function readJsonResponse(response) {
  return response.json().catch(() => ({}));
}

function getAccessToken(req) {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";
}

function parseEnabled(value) {
  return String(value).trim().toLowerCase() === "true";
}

function getTimestamp(value) {
  const timestamp = Date.parse(value ?? "");
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isValidPublicSiteUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getDeliveryUrl(supabaseUrl, userId) {
  const url = new URL("/rest/v1/account_email_deliveries", supabaseUrl);
  url.searchParams.set("user_id", `eq.${userId}`);
  url.searchParams.set(
    "template_version",
    `eq.${accountWelcomeTemplateVersion}`
  );
  return url;
}

function getServiceHeaders(serviceRoleKey, prefer) {
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  return headers;
}

async function getSupabaseUser(
  fetchImpl,
  supabaseUrl,
  authApiKey,
  accessToken
) {
  const response = await fetchImpl(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: authApiKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function getDelivery(fetchImpl, supabaseUrl, serviceRoleKey, userId) {
  const url = getDeliveryUrl(supabaseUrl, userId);
  url.searchParams.set(
    "select",
    "user_id,template_version,status,attempt_count,first_attempt_at,last_attempt_at,sent_at,provider_message_id,last_error"
  );
  url.searchParams.set("limit", "1");

  const response = await fetchImpl(url, {
    headers: getServiceHeaders(serviceRoleKey),
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error("Unable to read the account email delivery record.");
  }

  return Array.isArray(payload) ? (payload[0] ?? null) : null;
}

async function createDelivery(
  fetchImpl,
  supabaseUrl,
  serviceRoleKey,
  user,
  attemptedAt
) {
  const url = new URL("/rest/v1/account_email_deliveries", supabaseUrl);
  const response = await fetchImpl(url, {
    method: "POST",
    headers: getServiceHeaders(serviceRoleKey, "return=representation"),
    body: JSON.stringify({
      user_id: user.id,
      template_version: accountWelcomeTemplateVersion,
      recipient_email: user.email,
      status: "pending",
      attempt_count: 1,
      first_attempt_at: attemptedAt,
      last_attempt_at: attemptedAt,
    }),
  });
  const payload = await readJsonResponse(response);

  if (response.status === 409) {
    return { conflict: true, delivery: null };
  }

  if (!response.ok) {
    throw new Error("Unable to create the account email delivery record.");
  }

  return {
    conflict: false,
    delivery: Array.isArray(payload) ? (payload[0] ?? null) : null,
  };
}

async function claimFailedDelivery(
  fetchImpl,
  supabaseUrl,
  serviceRoleKey,
  userId,
  delivery,
  attemptedAt
) {
  const url = getDeliveryUrl(supabaseUrl, userId);
  url.searchParams.set("status", "eq.failed");
  url.searchParams.set("attempt_count", `eq.${delivery.attempt_count}`);

  const response = await fetchImpl(url, {
    method: "PATCH",
    headers: getServiceHeaders(serviceRoleKey, "return=representation"),
    body: JSON.stringify({
      status: "pending",
      attempt_count: delivery.attempt_count + 1,
      last_attempt_at: attemptedAt,
      last_error: null,
    }),
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error("Unable to claim the account email delivery retry.");
  }

  return Array.isArray(payload) ? (payload[0] ?? null) : null;
}

async function updateDelivery(
  fetchImpl,
  supabaseUrl,
  serviceRoleKey,
  userId,
  changes
) {
  const response = await fetchImpl(getDeliveryUrl(supabaseUrl, userId), {
    method: "PATCH",
    headers: getServiceHeaders(serviceRoleKey),
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error("Unable to update the account email delivery record.");
  }
}

function canRetryDelivery(delivery, nowTimestamp) {
  if (
    delivery.status !== "failed" ||
    delivery.attempt_count >= maxAttempts
  ) {
    return false;
  }

  const firstAttemptTimestamp = getTimestamp(delivery.first_attempt_at);
  return (
    firstAttemptTimestamp !== null &&
    nowTimestamp - firstAttemptTimestamp < resendIdempotencyWindowMs
  );
}

function describeProviderError(status, payload) {
  const detail =
    typeof payload?.message === "string"
      ? payload.message
      : JSON.stringify(payload);
  return `Resend ${status}: ${detail || "Unknown provider error."}`.slice(
    0,
    1000
  );
}

async function sendWelcomeEmail(fetchImpl, config, user) {
  const email = buildAccountWelcomeEmail(config.publicSiteUrl);
  const response = await fetchImpl(resendApiUrl, {
    method: "POST",
    signal: AbortSignal.timeout(10_000),
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `account-welcome/v${accountWelcomeTemplateVersion}/${user.id}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [user.email],
      reply_to: config.replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
      tags: [
        { name: "category", value: "account-welcome" },
        {
          name: "template_version",
          value: String(accountWelcomeTemplateVersion),
        },
      ],
    }),
  });
  const payload = await readJsonResponse(response);

  return { payload, response };
}

function getConfig(env) {
  return {
    authApiKey:
      env.SUPABASE_ANON_KEY ??
      env.VITE_SUPABASE_ANON_KEY ??
      env.SUPABASE_SERVICE_ROLE_KEY,
    cutoverTimestamp: getTimestamp(env.WELCOME_EMAIL_CUTOVER_AT),
    enabled: parseEnabled(env.WELCOME_EMAIL_ENABLED),
    from: env.WELCOME_EMAIL_FROM,
    publicSiteUrl: env.PUBLIC_SITE_URL,
    replyTo: env.WELCOME_EMAIL_REPLY_TO,
    resendApiKey: env.RESEND_API_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: env.SUPABASE_URL ?? env.VITE_SUPABASE_URL,
  };
}

function getMissingConfiguration(config) {
  return {
    cutoverAt: config.cutoverTimestamp === null,
    from: !config.from,
    publicSiteUrl: !isValidPublicSiteUrl(config.publicSiteUrl),
    replyTo: !config.replyTo,
    resendApiKey: !config.resendApiKey,
    serviceRoleKey: !config.serviceRoleKey,
  };
}

export function createAccountWelcomeHandler({
  env = process.env,
  fetchImpl = fetch,
  now = () => new Date(),
} = {}) {
  return async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      json(res, 405, { error: "Method not allowed." });
      return;
    }

    const config = getConfig(env);

    if (!config.supabaseUrl || !config.authApiKey) {
      json(res, 500, { error: "Supabase auth environment is missing." });
      return;
    }

    const accessToken = getAccessToken(req);
    if (!accessToken) {
      json(res, 401, { error: "You need to log in before sending email." });
      return;
    }

    try {
      const user = await getSupabaseUser(
        fetchImpl,
        config.supabaseUrl,
        config.authApiKey,
        accessToken
      );

      if (!user?.id || !user?.email) {
        json(res, 401, { error: "Your session expired. Please log in again." });
        return;
      }

      if (!config.enabled) {
        json(res, 200, { status: "skipped", reason: "disabled" });
        return;
      }

      const missing = getMissingConfiguration(config);
      if (Object.values(missing).some(Boolean)) {
        json(res, 500, {
          error: "Account welcome email environment is incomplete.",
          missing,
        });
        return;
      }

      const requestedVersion = Number(
        user.user_metadata?.account_welcome_email_version
      );
      const createdTimestamp = getTimestamp(user.created_at);

      if (
        requestedVersion !== accountWelcomeTemplateVersion ||
        createdTimestamp === null ||
        createdTimestamp < config.cutoverTimestamp
      ) {
        json(res, 200, { status: "skipped", reason: "not_eligible" });
        return;
      }

      const nowDate = now();
      const nowTimestamp = nowDate.getTime();
      const attemptedAt = nowDate.toISOString();
      let delivery = await getDelivery(
        fetchImpl,
        config.supabaseUrl,
        config.serviceRoleKey,
        user.id
      );

      if (delivery?.status === "sent") {
        json(res, 200, { status: "already_sent" });
        return;
      }

      if (!delivery) {
        const created = await createDelivery(
          fetchImpl,
          config.supabaseUrl,
          config.serviceRoleKey,
          user,
          attemptedAt
        );

        if (created.conflict) {
          delivery = await getDelivery(
            fetchImpl,
            config.supabaseUrl,
            config.serviceRoleKey,
            user.id
          );

          json(res, delivery?.status === "sent" ? 200 : 202, {
            status:
              delivery?.status === "sent" ? "already_sent" : "retry_pending",
          });
          return;
        }

        delivery = created.delivery;
      } else if (canRetryDelivery(delivery, nowTimestamp)) {
        delivery = await claimFailedDelivery(
          fetchImpl,
          config.supabaseUrl,
          config.serviceRoleKey,
          user.id,
          delivery,
          attemptedAt
        );

        if (!delivery) {
          json(res, 202, { status: "retry_pending" });
          return;
        }
      } else {
        json(res, 202, { status: "retry_pending" });
        return;
      }

      let providerResult;
      try {
        providerResult = await sendWelcomeEmail(fetchImpl, config, user);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown transport error.";

        await updateDelivery(
          fetchImpl,
          config.supabaseUrl,
          config.serviceRoleKey,
          user.id,
          {
            last_attempt_at: attemptedAt,
            last_error: `Ambiguous transport error: ${message}`.slice(0, 1000),
          }
        );

        console.error("[Account welcome] Resend transport error.", error);
        json(res, 202, { status: "retry_pending" });
        return;
      }

      if (!providerResult.response.ok || !providerResult.payload?.id) {
        const providerError = describeProviderError(
          providerResult.response.status,
          providerResult.payload
        );

        await updateDelivery(
          fetchImpl,
          config.supabaseUrl,
          config.serviceRoleKey,
          user.id,
          {
            status: "failed",
            last_attempt_at: attemptedAt,
            last_error: providerError,
          }
        );

        console.error("[Account welcome] Resend rejected the email.", {
          status: providerResult.response.status,
        });
        json(res, 202, { status: "retry_pending" });
        return;
      }

      await updateDelivery(
        fetchImpl,
        config.supabaseUrl,
        config.serviceRoleKey,
        user.id,
        {
          status: "sent",
          sent_at: attemptedAt,
          provider_message_id: providerResult.payload.id,
          last_error: null,
        }
      );

      json(res, 200, { status: "sent" });
    } catch (error) {
      console.error("[Account welcome] Unexpected delivery error.", error);
      json(res, 500, { error: "Unable to process the account welcome email." });
    }
  };
}

export default createAccountWelcomeHandler();
