import { afterEach, describe, expect, it, vi } from "vitest";

import { CsfloatHttpClient } from "../src/client.js";
import { CsfloatSdkError } from "../src/errors.js";

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
        "User-Agent": "csfloat-node-sdk/0.4.5",
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
      details: "404 page not found\n",
    });
  });
});
