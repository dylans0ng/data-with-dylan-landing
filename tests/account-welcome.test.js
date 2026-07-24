import assert from "node:assert/strict";
import test from "node:test";
import { createAccountWelcomeHandler } from "../api/account-welcome.js";

const fixedNow = new Date("2026-07-24T12:00:00.000Z");

function buildEnv(overrides = {}) {
  return {
    PUBLIC_SITE_URL: "https://example.com",
    RESEND_API_KEY: "re_test",
    SUPABASE_ANON_KEY: "anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    SUPABASE_URL: "https://project.supabase.co",
    WELCOME_EMAIL_CUTOVER_AT: "2026-07-24T00:00:00.000Z",
    WELCOME_EMAIL_ENABLED: "true",
    WELCOME_EMAIL_FROM: "Data with Dylan <hello@example.com>",
    WELCOME_EMAIL_REPLY_TO: "hello@example.com",
    ...overrides,
  };
}

function buildUser(overrides = {}) {
  return {
    id: "d70ad9f8-b5d7-4f33-9f07-d92ed2143495",
    email: "learner@example.com",
    created_at: "2026-07-24T11:55:00.000Z",
    user_metadata: {
      account_welcome_email_version: 1,
      email_list_opt_in: false,
    },
    ...overrides,
  };
}

function createRequest(overrides = {}) {
  return {
    method: "POST",
    headers: { authorization: "Bearer valid-session-token" },
    ...overrides,
  };
}

function createResponse() {
  return {
    body: null,
    headers: {},
    statusCode: 200,
    end(rawBody) {
      this.body = JSON.parse(rawBody);
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
  };
}

async function invoke(handler, request = createRequest()) {
  const response = createResponse();
  await handler(request, response);
  return response;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function createFetchService({
  initialDelivery = null,
  providerDelayMs = 0,
  providerResults = [{ status: 200, body: { id: "email-1" } }],
  user = buildUser(),
} = {}) {
  let delivery = initialDelivery ? { ...initialDelivery } : null;
  const resendRequests = [];
  const providerQueue = [...providerResults];

  async function fetchImpl(input, init = {}) {
    const url = new URL(String(input));
    const method = init.method ?? "GET";

    if (url.pathname === "/auth/v1/user") {
      return init.headers.Authorization === "Bearer valid-session-token"
        ? jsonResponse(user)
        : jsonResponse({ error: "invalid token" }, 401);
    }

    if (url.pathname === "/rest/v1/account_email_deliveries") {
      if (method === "GET") {
        return jsonResponse(delivery ? [delivery] : []);
      }

      if (method === "POST") {
        if (delivery) {
          return jsonResponse({ code: "23505" }, 409);
        }

        delivery = JSON.parse(init.body);
        return jsonResponse([delivery], 201);
      }

      if (method === "PATCH") {
        const changes = JSON.parse(init.body);
        const expectedStatus = url.searchParams
          .getAll("status")
          .find((value) => value.startsWith("eq."));
        const expectedAttempts = url.searchParams
          .getAll("attempt_count")
          .find((value) => value.startsWith("eq."));

        if (
          (expectedStatus &&
            delivery?.status !== expectedStatus.slice("eq.".length)) ||
          (expectedAttempts &&
            delivery?.attempt_count !==
              Number(expectedAttempts.slice("eq.".length)))
        ) {
          return jsonResponse([]);
        }

        delivery = { ...delivery, ...changes };
        const returnRepresentation = String(init.headers.Prefer).includes(
          "return=representation"
        );
        return jsonResponse(returnRepresentation ? [delivery] : {});
      }
    }

    if (url.toString() === "https://api.resend.com/emails") {
      resendRequests.push({
        body: JSON.parse(init.body),
        headers: init.headers,
      });

      if (providerDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, providerDelayMs));
      }

      const result = providerQueue.shift() ?? {
        status: 200,
        body: { id: `email-${resendRequests.length}` },
      };

      if (result.error) {
        throw result.error;
      }

      return jsonResponse(result.body, result.status);
    }

    throw new Error(`Unexpected request: ${method} ${url}`);
  }

  return {
    fetchImpl,
    getDelivery: () => delivery,
    resendRequests,
  };
}

test("requires an authenticated Supabase session", async () => {
  const service = createFetchService();
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const response = await invoke(
    handler,
    createRequest({ headers: {}, body: { email: "target@example.com" } })
  );

  assert.equal(response.statusCode, 401);
  assert.equal(service.resendRequests.length, 0);
});

test("rejects an invalid Supabase session token", async () => {
  const service = createFetchService();
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const response = await invoke(
    handler,
    createRequest({
      headers: { authorization: "Bearer invalid-session-token" },
    })
  );

  assert.equal(response.statusCode, 401);
  assert.equal(service.resendRequests.length, 0);
});

test("disabled delivery authenticates but skips without touching Resend", async () => {
  const service = createFetchService();
  const handler = createAccountWelcomeHandler({
    env: buildEnv({ WELCOME_EMAIL_ENABLED: "false" }),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const response = await invoke(handler);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { status: "skipped", reason: "disabled" });
  assert.equal(service.getDelivery(), null);
  assert.equal(service.resendRequests.length, 0);
});

test("incomplete email configuration fails safely without attempting delivery", async () => {
  const service = createFetchService();
  const handler = createAccountWelcomeHandler({
    env: buildEnv({ RESEND_API_KEY: "" }),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const response = await invoke(handler);

  assert.equal(response.statusCode, 500);
  assert.equal(service.getDelivery(), null);
  assert.equal(service.resendRequests.length, 0);
});

test("accounts created before the cutover are not eligible", async () => {
  const service = createFetchService({
    user: buildUser({ created_at: "2026-07-23T23:59:59.000Z" }),
  });
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const response = await invoke(handler);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    status: "skipped",
    reason: "not_eligible",
  });
  assert.equal(service.resendRequests.length, 0);
});

test("existing accounts without the welcome metadata marker are not eligible", async () => {
  const service = createFetchService({
    user: buildUser({
      user_metadata: { email_list_opt_in: true },
    }),
  });
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const response = await invoke(handler);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    status: "skipped",
    reason: "not_eligible",
  });
  assert.equal(service.resendRequests.length, 0);
});

for (const emailListOptIn of [false, true]) {
  test(`sends the transactional email when marketing opt-in is ${emailListOptIn}`, async () => {
    const user = buildUser({
      user_metadata: {
        account_welcome_email_version: 1,
        email_list_opt_in: emailListOptIn,
      },
    });
    const service = createFetchService({ user });
    const handler = createAccountWelcomeHandler({
      env: buildEnv(),
      fetchImpl: service.fetchImpl,
      now: () => fixedNow,
    });

    const response = await invoke(
      handler,
      createRequest({ body: { email: "attacker@example.com" } })
    );

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { status: "sent" });
    assert.equal(service.resendRequests.length, 1);
    assert.deepEqual(service.resendRequests[0].body.to, [user.email]);
    assert.equal(
      service.resendRequests[0].body.subject,
      "Your free PDF resources are unlocked"
    );
    assert.match(
      service.resendRequests[0].body.html,
      /https:\/\/example\.com\/resources/
    );
    assert.match(
      service.resendRequests[0].body.text,
      /does not subscribe you to marketing emails/
    );
    assert.equal(
      service.resendRequests[0].headers["Idempotency-Key"],
      `account-welcome/v1/${user.id}`
    );
    assert.equal(service.getDelivery().status, "sent");
  });
}

test("repeated auth events do not resend a completed email", async () => {
  const service = createFetchService();
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const firstResponse = await invoke(handler);
  const secondResponse = await invoke(handler);

  assert.deepEqual(firstResponse.body, { status: "sent" });
  assert.deepEqual(secondResponse.body, { status: "already_sent" });
  assert.equal(service.resendRequests.length, 1);
});

test("concurrent requests produce only one provider send", async () => {
  const service = createFetchService({ providerDelayMs: 20 });
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const [firstResponse, secondResponse] = await Promise.all([
    invoke(handler),
    invoke(handler),
  ]);
  const statuses = [firstResponse.body.status, secondResponse.body.status];

  assert.ok(statuses.includes("sent"));
  assert.ok(statuses.includes("retry_pending"));
  assert.equal(service.resendRequests.length, 1);
});

test("an explicit provider failure is recorded and retried safely", async () => {
  const service = createFetchService({
    providerResults: [
      { status: 503, body: { message: "temporarily unavailable" } },
      { status: 200, body: { id: "email-after-retry" } },
    ],
  });
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const firstResponse = await invoke(handler);
  const secondResponse = await invoke(handler);

  assert.equal(firstResponse.statusCode, 202);
  assert.deepEqual(firstResponse.body, { status: "retry_pending" });
  assert.deepEqual(secondResponse.body, { status: "sent" });
  assert.equal(service.resendRequests.length, 2);
  assert.equal(service.getDelivery().attempt_count, 2);
  assert.equal(service.getDelivery().status, "sent");
});

test("an ambiguous transport error is not automatically resent", async () => {
  const service = createFetchService({
    providerResults: [{ error: new Error("socket timeout") }],
  });
  const handler = createAccountWelcomeHandler({
    env: buildEnv(),
    fetchImpl: service.fetchImpl,
    now: () => fixedNow,
  });

  const firstResponse = await invoke(handler);
  const secondResponse = await invoke(handler);

  assert.equal(firstResponse.statusCode, 202);
  assert.deepEqual(secondResponse.body, { status: "retry_pending" });
  assert.equal(service.resendRequests.length, 1);
  assert.equal(service.getDelivery().status, "pending");
  assert.match(service.getDelivery().last_error, /Ambiguous transport error/);
});
