import { CsfloatSdkError, type CsfloatErrorKind } from "./errors.js";
import type { QueryParams } from "./types.js";
import { cleanParams } from "./utils.js";

const DEFAULT_USER_AGENT = "csfloat-node-sdk/0.9.1";
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 250;
const DEFAULT_MAX_RETRY_DELAY_MS = 2_000;
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);

export interface CsfloatRateLimitMetadata {
  limit?: number;
  remaining?: number;
  resetEpochSeconds?: number;
  resetAt?: string;
  retryAfterMs?: number;
  suggestedWaitMs?: number;
}

export interface CsfloatResponseMetadata {
  url: string;
  status: number;
  headers: Record<string, string>;
  rateLimit?: CsfloatRateLimitMetadata;
}

export interface CsfloatResponse<T> {
  data: T;
  meta: CsfloatResponseMetadata;
}

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
  if (!details || typeof details !== "object") {
    return undefined;
  }

  if ("message" in details) {
    const message = details.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  if ("error" in details) {
    const error = details.error;
    if (typeof error === "string" && error.length > 0) {
      return error;
    }
  }

  return undefined;
}

function parseIntegerHeader(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
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

function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};

  headers.forEach((value, key) => {
    record[key] = value;
  });

  return record;
}

function buildRateLimitMetadata(headers: Headers): CsfloatRateLimitMetadata | undefined {
  const limit = parseIntegerHeader(headers.get("X-Ratelimit-Limit"));
  const remaining = parseIntegerHeader(headers.get("X-Ratelimit-Remaining"));
  const resetEpochSeconds = parseIntegerHeader(headers.get("X-Ratelimit-Reset"));
  const retryAfterMs = parseRetryAfterMs(headers.get("Retry-After"));

  if (
    limit === undefined &&
    remaining === undefined &&
    resetEpochSeconds === undefined &&
    retryAfterMs === undefined
  ) {
    return undefined;
  }

  const resetAt = resetEpochSeconds === undefined
    ? undefined
    : new Date(resetEpochSeconds * 1000).toISOString();
  const resetMs = resetEpochSeconds === undefined ? undefined : resetEpochSeconds * 1000;
  let suggestedWaitMs: number | undefined;

  if (resetMs !== undefined) {
    if (remaining === 0) {
      suggestedWaitMs = Math.max(0, resetMs - Date.now());
    } else if (remaining !== undefined && remaining > 0) {
      suggestedWaitMs = Math.max(0, Math.floor((resetMs - Date.now()) / remaining));
    }
  }

  return {
    ...(limit === undefined ? {} : { limit }),
    ...(remaining === undefined ? {} : { remaining }),
    ...(resetEpochSeconds === undefined ? {} : { resetEpochSeconds }),
    ...(resetAt === undefined ? {} : { resetAt }),
    ...(retryAfterMs === undefined ? {} : { retryAfterMs }),
    ...(suggestedWaitMs === undefined ? {} : { suggestedWaitMs }),
  };
}

function buildResponseMetadata(url: URL, response: Response): CsfloatResponseMetadata {
  const headers = headersToRecord(response.headers);
  const rateLimit = buildRateLimitMetadata(response.headers);

  return {
    url: response.url || url.toString(),
    status: response.status,
    headers,
    ...(rateLimit === undefined ? {} : { rateLimit }),
  };
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
  defaultHeaders?: Record<string, string>;
  sendAuthorization?: boolean;
  minRequestDelayMs?: number;
  timeoutMs?: number;
  userAgent?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  maxRetryDelayMs?: number;
  retryUnsafeRequests?: boolean;
  fetch?: CsfloatFetch;
  dispatcher?: unknown;
}

interface CsfloatRequestPacingState {
  nextRequestTime: number;
  tail: Promise<void>;
}

export class CsfloatHttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly sendAuthorization: boolean;
  private readonly minRequestDelayMs: number;
  private readonly timeoutMs: number;
  private readonly userAgent: string;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;
  private readonly maxRetryDelayMs: number;
  private readonly retryUnsafeRequests: boolean;
  private readonly fetchImpl: CsfloatFetch;
  private readonly dispatcher?: unknown;
  private readonly pacingState: CsfloatRequestPacingState | undefined;

  constructor(
    options: CsfloatClientOptions & {
      pacingState?: CsfloatRequestPacingState;
    },
  ) {
    if (!options.apiKey) {
      throw new CsfloatSdkError("Missing required option: apiKey");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://csfloat.com/api/v1";
    this.defaultHeaders = { ...(options.defaultHeaders ?? {}) };
    this.sendAuthorization = options.sendAuthorization ?? true;
    this.minRequestDelayMs = options.minRequestDelayMs ?? 0;

    if (!Number.isInteger(this.minRequestDelayMs) || this.minRequestDelayMs < 0) {
      throw new CsfloatSdkError("minRequestDelayMs must be a non-negative integer");
    }

    this.timeoutMs = options.timeoutMs ?? 15_000;
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
    this.maxRetryDelayMs = options.maxRetryDelayMs ?? DEFAULT_MAX_RETRY_DELAY_MS;
    this.retryUnsafeRequests = options.retryUnsafeRequests ?? false;
    this.fetchImpl = options.fetch ?? fetch;
    this.dispatcher = options.dispatcher;
    this.pacingState = this.minRequestDelayMs > 0
      ? options.pacingState ?? {
          nextRequestTime: 0,
          tail: Promise.resolve(),
        }
      : undefined;
  }

  derive(options: Partial<CsfloatClientOptions> & { apiKey?: string } = {}): CsfloatHttpClient {
    const minRequestDelayMs = options.minRequestDelayMs ?? this.minRequestDelayMs;

    const sharedPacingState =
      minRequestDelayMs > 0 && options.minRequestDelayMs === undefined
        ? this.pacingState
        : undefined;

    return new CsfloatHttpClient({
      apiKey: options.apiKey ?? this.apiKey,
      baseUrl: options.baseUrl ?? this.baseUrl,
      defaultHeaders: {
        ...this.defaultHeaders,
        ...(options.defaultHeaders ?? {}),
      },
      sendAuthorization: options.sendAuthorization ?? this.sendAuthorization,
      minRequestDelayMs,
      timeoutMs: options.timeoutMs ?? this.timeoutMs,
      userAgent: options.userAgent ?? this.userAgent,
      maxRetries: options.maxRetries ?? this.maxRetries,
      retryDelayMs: options.retryDelayMs ?? this.retryDelayMs,
      maxRetryDelayMs: options.maxRetryDelayMs ?? this.maxRetryDelayMs,
      retryUnsafeRequests: options.retryUnsafeRequests ?? this.retryUnsafeRequests,
      fetch: options.fetch ?? this.fetchImpl,
      dispatcher: options.dispatcher ?? this.dispatcher,
      ...(sharedPacingState === undefined ? {} : { pacingState: sharedPacingState }),
    });
  }

  async get<T>(
    path: string,
    params?: QueryParams,
  ): Promise<T> {
    return this
      .requestWithMetadata<T>("GET", path, params === undefined ? undefined : { params })
      .then((response) => response.data);
  }

  async post<T>(path: string, body: unknown, params?: QueryParams): Promise<T> {
    return this
      .requestWithMetadata<T>("POST", path, params === undefined ? { body } : { body, params })
      .then((response) => response.data);
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    return this.requestWithMetadata<T>("PATCH", path, { body }).then((response) => response.data);
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    return this.requestWithMetadata<T>("PUT", path, { body }).then((response) => response.data);
  }

  async delete<T>(path: string): Promise<T> {
    return this.requestWithMetadata<T>("DELETE", path).then((response) => response.data);
  }

  async getWithMetadata<T>(
    path: string,
    params?: QueryParams,
  ): Promise<CsfloatResponse<T>> {
    return this.requestWithMetadata<T>(
      "GET",
      path,
      params === undefined ? undefined : { params },
    );
  }

  async postWithMetadata<T>(
    path: string,
    body: unknown,
    params?: QueryParams,
  ): Promise<CsfloatResponse<T>> {
    return this.requestWithMetadata<T>(
      "POST",
      path,
      params === undefined ? { body } : { body, params },
    );
  }

  async patchWithMetadata<T>(path: string, body: unknown): Promise<CsfloatResponse<T>> {
    return this.requestWithMetadata<T>("PATCH", path, { body });
  }

  async putWithMetadata<T>(path: string, body: unknown): Promise<CsfloatResponse<T>> {
    return this.requestWithMetadata<T>("PUT", path, { body });
  }

  async deleteWithMetadata<T>(path: string): Promise<CsfloatResponse<T>> {
    return this.requestWithMetadata<T>("DELETE", path);
  }

  private async waitForPacingTurn(): Promise<void> {
    if (!this.pacingState) {
      return;
    }

    const state = this.pacingState;
    const turn = state.tail.then(async () => {
      const waitMs = Math.max(0, state.nextRequestTime - Date.now());
      await sleep(waitMs);
      state.nextRequestTime = Date.now() + this.minRequestDelayMs;
    });

    state.tail = turn.catch(() => undefined);
    await turn;
  }

  private async requestWithMetadata<T>(
    method: string,
    path: string,
    options: {
      params?: QueryParams;
      body?: unknown;
    } | undefined = undefined,
  ): Promise<CsfloatResponse<T>> {
    const url = new URL(path, `${this.baseUrl}/`);
    if (options?.params) {
      url.search = cleanParams(options.params).toString();
    }
    const canRetry = isRetryableMethod(method, this.retryUnsafeRequests);

    for (let attempt = 0; ; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        await this.waitForPacingTurn();

        const init: RequestInit & { dispatcher?: unknown } = {
          method,
          headers: {
            "User-Agent": this.userAgent,
            ...this.defaultHeaders,
            ...(this.sendAuthorization ? { Authorization: this.apiKey } : {}),
            "Content-Type": "application/json",
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
        const meta = buildResponseMetadata(url, response);

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

        return {
          data: data as T,
          meta,
        };
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
