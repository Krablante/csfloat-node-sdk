import { afterEach, describe, expect, it, vi } from "vitest";

import { CsfloatHttpClient } from "../src/client.js";
import { CsfloatSdkError, isCsfloatSdkError } from "../src/errors.js";

describe("CsfloatHttpClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the current default user agent", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({ apiKey: "secret" });

    await client.get("me");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init).toMatchObject({
      method: "GET",
      headers: expect.objectContaining({
        Authorization: "secret",
        "User-Agent": "csfloat-node-sdk/0.5.0",
      }),
    });
  });

  it("preserves structured error details", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ code: 4, message: "invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({ apiKey: "secret" });

    await expect(client.get("listings")).rejects.toMatchObject<CsfloatSdkError>({
      name: "CsfloatSdkError",
      status: 400,
      code: "4",
      kind: "validation",
      retryable: false,
      apiMessage: "invalid type",
      details: {
        code: 4,
        message: "invalid type",
      },
    });
  });

  it("preserves plain-text error details instead of throwing a parse error", async () => {
    const fetchMock = vi.fn(async () =>
      new Response("404 page not found\n", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({ apiKey: "secret" });

    await expect(client.get("missing")).rejects.toMatchObject<CsfloatSdkError>({
      name: "CsfloatSdkError",
      status: 404,
      kind: "not_found",
      details: "404 page not found\n",
    });
  });

  it("classifies role-gated responses", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          code: 17,
          message: "sellers can only use the counter-offers endpoint",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({ apiKey: "secret" });

    await expect(client.post("offers", {})).rejects.toMatchObject<CsfloatSdkError>({
      status: 403,
      kind: "role_gated",
      apiMessage: "sellers can only use the counter-offers endpoint",
    });
  });

  it("classifies account-gated responses", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          code: 134,
          message: "You need to fully onboard with Stripe for payouts to list further items",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({ apiKey: "secret" });

    await expect(client.post("listings", {})).rejects.toMatchObject<CsfloatSdkError>({
      status: 400,
      kind: "account_gated",
      apiMessage: "You need to fully onboard with Stripe for payouts to list further items",
    });
  });

  it("retries retryable GET requests on 429 and succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ code: 20, message: "too many requests" }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "0",
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({
      apiKey: "secret",
      maxRetries: 1,
      retryDelayMs: 0,
      maxRetryDelayMs: 0,
    });

    await expect(client.get("schema")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries GET requests on transient network failures", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({
      apiKey: "secret",
      maxRetries: 1,
      retryDelayMs: 0,
      maxRetryDelayMs: 0,
    });

    await expect(client.get("schema")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry unsafe requests unless explicitly enabled", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ code: 20, message: "too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({
      apiKey: "secret",
      maxRetries: 1,
      retryDelayMs: 0,
      maxRetryDelayMs: 0,
    });

    await expect(client.post("offers", {})).rejects.toMatchObject<CsfloatSdkError>({
      name: "CsfloatSdkError",
      status: 429,
      kind: "rate_limit",
      retryable: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("classifies transport failures as network errors", async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({
      apiKey: "secret",
      maxRetries: 0,
    });

    await expect(client.get("schema")).rejects.toMatchObject<CsfloatSdkError>({
      kind: "network",
      retryable: true,
    });
  });

  it("exports a working CsfloatSdkError type guard", () => {
    expect(isCsfloatSdkError(new CsfloatSdkError("boom"))).toBe(true);
    expect(isCsfloatSdkError(new Error("boom"))).toBe(false);
  });

  it("uses injected fetch implementation when provided", async () => {
    const customFetch = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new CsfloatHttpClient({
      apiKey: "secret",
      fetch: customFetch as typeof fetch,
    });

    await expect(client.get("schema")).resolves.toEqual({ ok: true });
    expect(customFetch).toHaveBeenCalledTimes(1);
  });

  it("forwards dispatcher to fetch init when provided", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const dispatcher = { kind: "proxy-dispatcher" };
    vi.stubGlobal("fetch", fetchMock);

    const client = new CsfloatHttpClient({
      apiKey: "secret",
      dispatcher,
    });

    await client.get("schema");

    const [, init] = fetchMock.mock.calls[0];
    expect(init).toMatchObject({
      dispatcher,
    });
  });
});
