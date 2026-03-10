# Transport, Errors, And Metadata

## Transport Defaults

The SDK already ships safer defaults than a thin wrapper:

- timeout handling
- retry/backoff for safe requests
- optional client-side pacing with `minRequestDelayMs`
- typed error classification
- custom `fetch` / dispatcher support

## Error Model

Non-2xx responses throw `CsfloatSdkError`.

Important fields:

- `status`
- `code`
- `kind`
- `retryable`
- `apiMessage`
- `details`

Typical `kind` values:

- `validation`
- `authentication`
- `authorization`
- `account_gated`
- `role_gated`
- `not_found`
- `rate_limit`
- `server`
- `timeout`
- `network`

## Opt-In Response Metadata

Most users should keep using normal resource methods.

If you need low-level response visibility, use the new client methods:

```ts
import { CsfloatSdk, type CsfloatMeResponse } from "csfloat-node-sdk";

const sdk = new CsfloatSdk({
  apiKey: process.env.CSFLOAT_API_KEY!,
});

const response = await sdk.client.getWithMetadata<CsfloatMeResponse>("me");

console.log(response.data.user.steam_id);
console.log(response.meta.status);
console.log(response.meta.rateLimit?.remaining);
console.log(response.meta.rateLimit?.resetAt);
```

Available methods:

- `getWithMetadata()`
- `postWithMetadata()`
- `patchWithMetadata()`
- `putWithMetadata()`
- `deleteWithMetadata()`

## When Metadata Is Worth Using

- bots that want explicit rate-limit visibility
- operator tooling
- debugging edge cases on gated routes
- telemetry or internal wrappers built on top of this SDK

## When Not To Use It

Do not rewrite all application code around raw metadata if you do not need it.
For most consumers, resource methods plus typed errors remain the cleaner API.
