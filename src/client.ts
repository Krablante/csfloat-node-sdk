import { CsfloatSdkError, type CsfloatErrorKind } from "./errors.js";
import type { QueryParams } from "./types.js";
import { cleanParams } from "./utils.js";

const DEFAULT_USER_AGENT = "csfloat-node-sdk/0.7.0";
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 250;
const DEFAULT_MAX_RETRY_DELAY_MS = 2_000;
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);

function parseResponseBody(text: string): unknown {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorCode(details: unknown): string | undefined {
  if (!details || typeof details !== "object" || !("code" in details)) {
    return undefined;
  }

  const code = details.code;
  return code === undefined || code === null ? undefined : String(code);
}

function extractApiMessage(details: unknown): string | undefined {
  if (!details || typeof details !== "object" || !("message" in details)) {
    return undefined;
  }

  const message = details.message;
  return typeof message === "string" && message.length > 0 ? message : undefined;
}

function classifyApiError(
  status: number,
  details: unknown,
): CsfloatErrorKind {
  const apiMessage = extractApiMessage(details)?.toLowerCase() ?? "";

  if (status === 401) {
    return "authentication";
  }

  if (status === 403) {
    if (apiMessage.includes("counter-offers endpoint")) {
      return "role_gated";
    }

    return "authorization";
  }

  if (status === 404) {
    return "not_found";
  }

  if (status === 429) {
    return "rate_limit";
  }

  if (status >= 500) {
    return "server";
  }

  if (status === 400) {
    if (
      apiMessage.includes("fully onboard") ||
      apiMessage.includes("stripe") ||
      apiMessage.includes("payout")
    ) {
      return "account_gated";
    }

    if (apiMessage.includes("counter-offers endpoint")) {
      return "role_gated";
    }

    return "validation";
  }

  return "unknown";
}

function getErrorMessage(
  status: number | undefined,
  apiMessage: string | undefined,
  fallback: string,
): string {
  if (status === undefined) {
    return fallback;
  }

  if (!apiMessage) {
    return `CSFloat API request failed with status ${status}`;
  }

  return `CSFloat API request failed with status ${status}: ${apiMessage}`;
}

function isRetryableKind(kind: CsfloatErrorKind): boolean {
  return kind === "rate_limit" || kind === "server" || kind === "timeout" || kind === "network";
}

function isRetryableMethod(method: string, retryUnsafeRequests: boolean): boolean {
  return retryUnsafeRequests || method === "GET";
}

function parseRetryAfterMs(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const date = Date.parse(value);
  if (Number.isNaN(date)) {
    return undefined;
  }

  return Math.max(0, date - Date.now());
}

function getRetryDelayMs(
  attempt: number,
  retryAfterHeader: string | null,
  {
    retryDelayMs,
    maxRetryDelayMs,
  }: {
    retryDelayMs: number;
    maxRetryDelayMs: number;
  },
): number {
  const retryAfterMs = parseRetryAfterMs(retryAfterHeader);
  if (retryAfterMs !== undefined) {
    return Math.min(retryAfterMs, maxRetryDelayMs);
  }

  return Math.min(retryDelayMs * 2 ** attempt, maxRetryDelayMs);
}

async function sleep(ms: number): Promise<void> {
  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
}

export type CsfloatFetch = typeof fetch;

export interface CsfloatClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  userAgent?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  maxRetryDelayMs?: number;
  retryUnsafeRequests?: boolean;
  fetch?: CsfloatFetch;
  dispatcher?: unknown;
}

export class CsfloatHttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly userAgent: string;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;
  private readonly maxRetryDelayMs: number;
  private readonly retryUnsafeRequests: boolean;
  private readonly fetchImpl: CsfloatFetch;
  private readonly dispatcher?: unknown;

  constructor(options: CsfloatClientOptions) {
    if (!options.apiKey) {
      throw new CsfloatSdkError("Missing required option: apiKey");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://csfloat.com/api/v1";
    this.timeoutMs = options.timeoutMs ?? 15_000;
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
    this.maxRetryDelayMs = options.maxRetryDelayMs ?? DEFAULT_MAX_RETRY_DELAY_MS;
    this.retryUnsafeRequests = options.retryUnsafeRequests ?? false;
    this.fetchImpl = options.fetch ?? fetch;
    this.dispatcher = options.dispatcher;
  }

  derive(options: Partial<CsfloatClientOptions> & { apiKey?: string } = {}): CsfloatHttpClient {
    return new CsfloatHttpClient({
      apiKey: options.apiKey ?? this.apiKey,
      baseUrl: options.baseUrl ?? this.baseUrl,
      timeoutMs: options.timeoutMs ?? this.timeoutMs,
      userAgent: options.userAgent ?? this.userAgent,
      maxRetries: options.maxRetries ?? this.maxRetries,
      retryDelayMs: options.retryDelayMs ?? this.retryDelayMs,
      maxRetryDelayMs: options.maxRetryDelayMs ?? this.maxRetryDelayMs,
      retryUnsafeRequests: options.retryUnsafeRequests ?? this.retryUnsafeRequests,
      fetch: options.fetch ?? this.fetchImpl,
      dispatcher: options.dispatcher ?? this.dispatcher,
    });
  }

  async get<T>(
    path: string,
    params?: QueryParams,
  ): Promise<T> {
    return this.request<T>(
      "GET",
      path,
      params === undefined ? undefined : { params },
    );
  }

  async post<T>(path: string, body: unknown, params?: QueryParams): Promise<T> {
    return this.request<T>(
      "POST",
      path,
      params === undefined ? { body } : { body, params },
    );
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PATCH", path, { body });
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  private async request<T>(
    method: string,
    path: string,
    options: {
      params?: QueryParams;
      body?: unknown;
    } | undefined = undefined,
  ): Promise<T> {
    const url = new URL(path, `${this.baseUrl}/`);
    if (options?.params) {
      url.search = cleanParams(options.params).toString();
    }
    const canRetry = isRetryableMethod(method, this.retryUnsafeRequests);

    for (let attempt = 0; ; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const init: RequestInit & { dispatcher?: unknown } = {
          method,
          headers: {
            Authorization: this.apiKey,
            "Content-Type": "application/json",
            "User-Agent": this.userAgent,
          },
          signal: controller.signal,
        };

        if (options?.body !== undefined) {
          init.body = JSON.stringify(options.body);
        }

        if (this.dispatcher !== undefined) {
          init.dispatcher = this.dispatcher;
        }

        const response = await this.fetchImpl(url, init);

        const text = await response.text();
        const data = parseResponseBody(text);

        if (!response.ok) {
          if (
            canRetry &&
            attempt < this.maxRetries &&
            RETRYABLE_STATUS_CODES.has(response.status)
          ) {
            await sleep(
              getRetryDelayMs(attempt, response.headers.get("Retry-After"), {
                retryDelayMs: this.retryDelayMs,
                maxRetryDelayMs: this.maxRetryDelayMs,
              }),
            );
            continue;
          }

          const code = extractErrorCode(data);
          const apiMessage = extractApiMessage(data);
          const kind = classifyApiError(response.status, data);
          throw new CsfloatSdkError(getErrorMessage(response.status, apiMessage, "CSFloat API request failed"), {
            status: response.status,
            details: data,
            kind,
            retryable: canRetry && isRetryableKind(kind),
            ...(code === undefined ? {} : { code }),
            ...(apiMessage === undefined ? {} : { apiMessage }),
          });
        }

        return data as T;
      } catch (error) {
        if (error instanceof CsfloatSdkError) {
          throw error;
        }

        if (error instanceof Error && error.name === "AbortError") {
          throw new CsfloatSdkError("CSFloat API request timed out", {
            kind: "timeout",
            retryable: canRetry,
            cause: error,
          });
        }

        if (canRetry && attempt < this.maxRetries) {
          await sleep(
            getRetryDelayMs(attempt, null, {
              retryDelayMs: this.retryDelayMs,
              maxRetryDelayMs: this.maxRetryDelayMs,
            }),
          );
          continue;
        }

        throw new CsfloatSdkError("CSFloat API request failed", {
          details: error,
          kind: "network",
          retryable: canRetry,
          cause: error,
        });
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
