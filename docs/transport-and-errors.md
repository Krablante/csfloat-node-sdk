# Transport, Errors, And Metadata

## Normal Entry Point vs Low-Level Client

Most users should use `CsfloatSdk` resource methods and only drop to `sdk.client` when they need lower-level behavior.

The package also exports `CsfloatHttpClient` directly, but normal code rarely needs to instantiate it on its own.

## `CsfloatClientOptions`

`new CsfloatSdk(options)` and `new CsfloatHttpClient(options)` share the same option shape:

| Option | Purpose |
|---|---|
| `apiKey` | required credential for the normal SDK flow |
| `baseUrl` | override the API base URL |
| `defaultHeaders` | add fixed headers to every request |
| `sendAuthorization` | disable `Authorization` for special companion calls |
| `minRequestDelayMs` | opt-in client-side pacing between requests |
| `timeoutMs` | per-request timeout |
| `userAgent` | override the default user agent string |
| `maxRetries` | maximum retry attempts for retryable failures |
| `retryDelayMs` | base retry delay before backoff |
| `maxRetryDelayMs` | upper bound for retry delay |
| `retryUnsafeRequests` | allow retries beyond `GET` requests |
| `fetch` | provide a custom fetch implementation |
| `dispatcher` | pass a custom undici-style dispatcher or proxy-aware transport object |

## Plain Data Methods

The low-level client exposes:

- `get()`
- `post()`
- `patch()`
- `put()`
- `delete()`

These return the parsed response body directly.

Example:

```ts
import {
  CsfloatHttpClient,
  type CsfloatMeResponse,
} from "csfloat-node-sdk";

const client = new CsfloatHttpClient({
  apiKey: process.env.CSFLOAT_API_KEY!,
});

const me = await client.get<CsfloatMeResponse>("me");
console.log(me.user.username);
```

## `derive()` For Related Clients

`client.derive()` creates a new client with overridden options while preserving the existing transport setup where it makes sense.

The SDK uses this internally for:

- `meta.inspectItem()`
  to target the historical inspect companion base URL and send the required `Origin` header
- `loadout.*`
  to target the loadout companion base URL and swap auth to `Bearer <recommender-token>`

As of the 2026-04-14 live retest, the historical inspect companion host no longer resolves from CLI probes, so `meta.inspectItem()` is currently a degraded helper and now surfaces a clearer SDK network error for that specific failure mode.

You can use the same pattern yourself:

```ts
const loadoutClient = sdk.client.derive({
  apiKey: `Bearer ${token}`,
  baseUrl: "https://loadout-api.csfloat.com/v1",
});
```

## Retry, Backoff, Timeout, And Pacing

The transport layer is deliberately stronger than a thin wrapper:

- timeout handling is built in
- retry/backoff exists for retryable failures
- retries are `GET`-only by default unless `retryUnsafeRequests` is enabled
- `Retry-After` is respected when present
- `minRequestDelayMs` adds opt-in pacing between requests

This makes the SDK usable for bots and operator tooling without forcing everyone into a fully custom transport layer.

## Opt-In Response Metadata

If you need raw status, headers, or parsed rate-limit context, use the metadata variants:

- `getWithMetadata()`
- `postWithMetadata()`
- `patchWithMetadata()`
- `putWithMetadata()`
- `deleteWithMetadata()`

Example:

```ts
import { CsfloatSdk, type CsfloatMeResponse } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
});

const response = await sdk.client.getWithMetadata<CsfloatMeResponse>("me");

console.log(response.data.user.steam_id);
console.log(response.meta.status);
console.log(response.meta.headers["x-ratelimit-remaining"]);
console.log(response.meta.rateLimit?.remaining);
console.log(response.meta.rateLimit?.resetAt);
```

Metadata response shape:

- `response.data`
  Parsed payload
- `response.meta.url`
  Final request URL
- `response.meta.status`
  HTTP status
- `response.meta.headers`
  Lower-level headers as a string record
- `response.meta.rateLimit`
  Parsed rate-limit metadata when headers are present

Parsed rate-limit fields:

- `limit`
- `remaining`
- `resetEpochSeconds`
- `resetAt`
- `retryAfterMs`
- `suggestedWaitMs`

## When Metadata Is Worth Using

- bots that need explicit rate-limit visibility
- operator dashboards
- internal wrappers built on top of this SDK
- debugging edge cases on gated or rate-limited routes

For most application code, resource methods remain the cleaner default API.

## Error Model

Non-2xx responses throw `CsfloatSdkError`.

Important fields:

- `status`
- `code`
- `kind`
- `retryable`
- `apiMessage`
- `details`

Use the exported type guard when needed:

```ts
import { isCsfloatSdkError } from "csfloat-node-sdk";

try {
  await sdk.account.getMe();
} catch (error) {
  if (isCsfloatSdkError(error)) {
    console.error(error.kind, error.status, error.apiMessage);
  }
}
```

## `CsfloatErrorKind`

| Kind | Typical Meaning |
|---|---|
| `validation` | request shape or input value rejected by the API |
| `authentication` | missing or invalid auth |
| `authorization` | authenticated but not allowed |
| `account_gated` | route exists but your account state is not eligible |
| `role_gated` | seller/buyer role or flow restriction |
| `not_found` | route or entity not found |
| `rate_limit` | rate-limited request |
| `server` | CSFloat-side server failure |
| `timeout` | client-side timeout |
| `network` | fetch/transport failure |
| `unknown` | fallback classification |

## When To Drop To The Client

Drop to `sdk.client` or `CsfloatHttpClient` when you need one of these:

- raw response metadata
- custom base URLs or derived companion clients
- a transport wrapper layered on top of the SDK
- explicit header access

Otherwise, prefer the higher-level resource methods documented in [Resource Reference](./resource-reference.md).
