import { CsfloatSdkError } from "./errors.js";
import type { QueryParams } from "./types.js";
import { cleanParams } from "./utils.js";

const DEFAULT_USER_AGENT = "csfloat-node-sdk/0.4.5";

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

export interface CsfloatClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  userAgent?: string;
}

export class CsfloatHttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly userAgent: string;

  constructor(options: CsfloatClientOptions) {
    if (!options.apiKey) {
      throw new CsfloatSdkError("Missing required option: apiKey");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://csfloat.com/api/v1";
    this.timeoutMs = options.timeoutMs ?? 15_000;
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
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

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, { body });
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PATCH", path, { body });
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

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const init: RequestInit = {
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

      const response = await fetch(url, init);

      const text = await response.text();
      const data = parseResponseBody(text);

      if (!response.ok) {
        const code = extractErrorCode(data);
        throw new CsfloatSdkError(
          `CSFloat API request failed with status ${response.status}`,
          {
            status: response.status,
            details: data,
            ...(code === undefined ? {} : { code }),
          },
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof CsfloatSdkError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new CsfloatSdkError("CSFloat API request timed out");
      }

      throw new CsfloatSdkError("CSFloat API request failed", {
        details: error,
      });
    } finally {
      clearTimeout(timer);
    }
  }
}
