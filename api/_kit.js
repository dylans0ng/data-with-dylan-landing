export const defaultKitV4ApiBaseUrl = "https://api.kit.com/v4";
export const defaultConvertKitV3ApiBaseUrl = "https://api.convertkit.com/v3";

export async function readJsonResponse(response) {
  return response.json().catch(() => ({}));
}

export function normalizeTagId(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return String(value).trim();
}

function buildKitV4Headers(apiKey) {
  return {
    "Content-Type": "application/json",
    "X-Kit-Api-Key": apiKey,
  };
}

export async function createOrUpdateKitSubscriber({
  apiBaseUrl = defaultKitV4ApiBaseUrl,
  apiKey,
  email,
  firstName,
}) {
  const body = {
    email_address: email,
    state: "active",
  };

  if (firstName) {
    body.first_name = firstName;
  }

  const response = await fetch(`${apiBaseUrl}/subscribers`, {
    method: "POST",
    headers: buildKitV4Headers(apiKey),
    body: JSON.stringify(body),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || !payload.subscriber?.id) {
    return {
      ok: false,
      statusCode: response.ok ? 502 : response.status,
      body: {
        error: "Unable to create or update the Kit subscriber.",
        kitResponse: payload,
      },
    };
  }

  return {
    ok: true,
    statusCode: 200,
    body: {
      subscriber: payload.subscriber,
    },
  };
}

export async function tagKitSubscriber({
  apiBaseUrl = defaultKitV4ApiBaseUrl,
  apiKey,
  subscriberId,
  tagId,
}) {
  const response = await fetch(
    `${apiBaseUrl}/tags/${tagId}/subscribers/${subscriberId}`,
    {
      method: "POST",
      headers: buildKitV4Headers(apiKey),
      body: JSON.stringify({}),
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    return {
      ok: false,
      statusCode: response.status,
      body: {
        error: "Unable to tag the Kit subscriber.",
        kitResponse: payload,
      },
    };
  }

  return {
    ok: true,
    statusCode: 200,
    body: payload,
  };
}

export async function addKitSubscriberToFormByEmail({
  apiBaseUrl = defaultKitV4ApiBaseUrl,
  apiKey,
  formId,
  email,
  referrer,
}) {
  if (!formId) {
    return {
      ok: true,
      statusCode: 200,
      body: {
        skipped: true,
      },
    };
  }

  const body = {
    email_address: email,
  };

  if (referrer) {
    body.referrer = referrer;
  }

  const response = await fetch(`${apiBaseUrl}/forms/${formId}/subscribers`, {
    method: "POST",
    headers: buildKitV4Headers(apiKey),
    body: JSON.stringify(body),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || !payload.subscriber?.id) {
    return {
      ok: false,
      statusCode: response.ok ? 502 : response.status,
      body: {
        error: "Unable to add the Kit subscriber to the form.",
        kitResponse: payload,
      },
    };
  }

  return {
    ok: true,
    statusCode: 200,
    body: {
      subscriber: payload.subscriber,
    },
  };
}

export async function syncKitSubscriberV4({
  apiBaseUrl = defaultKitV4ApiBaseUrl,
  apiKey,
  email,
  firstName,
  tagIds,
  formId,
  referrer,
}) {
  const normalizedTagIds = tagIds.map(normalizeTagId).filter(Boolean);

  if (!apiKey || normalizedTagIds.length === 0) {
    return {
      ok: true,
      statusCode: 200,
      body: {
        skipped: true,
        synced: false,
      },
    };
  }

  const subscriberResult = await createOrUpdateKitSubscriber({
    apiBaseUrl,
    apiKey,
    email,
    firstName,
  });

  if (!subscriberResult.ok) {
    return subscriberResult;
  }

  const subscriberId = subscriberResult.body.subscriber.id;
  const taggedIds = [];

  const formResult = await addKitSubscriberToFormByEmail({
    apiBaseUrl,
    apiKey,
    formId,
    email,
    referrer,
  });

  if (!formResult.ok) {
    return formResult;
  }

  for (const tagId of normalizedTagIds) {
    const tagResult = await tagKitSubscriber({
      apiBaseUrl,
      apiKey,
      subscriberId,
      tagId,
    });

    if (!tagResult.ok) {
      return tagResult;
    }

    taggedIds.push(tagId);
  }

  return {
    ok: true,
    statusCode: 200,
    body: {
      provider: "kit-v4",
      subscriberId,
      taggedIds,
      synced: true,
    },
  };
}

export async function subscribeConvertKitV3Form({
  apiBaseUrl = defaultConvertKitV3ApiBaseUrl,
  apiKey,
  formId,
  email,
  firstName,
  tagIds,
}) {
  if (!apiKey || !formId) {
    return {
      ok: true,
      statusCode: 200,
      body: {
        skipped: true,
        synced: false,
      },
    };
  }

  const requestBody = {
    email,
    tags: tagIds.map(normalizeTagId).filter(Boolean).map(Number),
  };

  if (firstName) {
    requestBody.first_name = firstName;
  }

  const response = await fetch(
    `${apiBaseUrl}/forms/${formId}/subscribe?api_key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  const payload = await readJsonResponse(response);

  if (!response.ok || !payload.subscription) {
    return {
      ok: false,
      statusCode: response.ok ? 502 : response.status,
      body: {
        error: "Unable to subscribe through ConvertKit V3.",
        kitResponse: payload,
      },
    };
  }

  return {
    ok: true,
    statusCode: 200,
    body: {
      provider: "convertkit-v3",
      synced: true,
    },
  };
}

export async function subscribeConvertKitV3Tag({
  apiBaseUrl = defaultConvertKitV3ApiBaseUrl,
  apiSecret,
  email,
  tagId,
}) {
  if (!apiSecret || !tagId) {
    return {
      ok: true,
      statusCode: 200,
      body: {
        skipped: true,
        synced: false,
      },
    };
  }

  const response = await fetch(`${apiBaseUrl}/tags/${tagId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_secret: apiSecret,
      email,
    }),
  });

  const payload = await readJsonResponse(response);

  if (!response.ok) {
    return {
      ok: false,
      statusCode: response.status,
      body: {
        error: "Unable to sync the subscriber to Kit.",
        kitResponse: payload,
      },
    };
  }

  return {
    ok: true,
    statusCode: 200,
    body: {
      provider: "convertkit-v3",
      synced: true,
    },
  };
}
