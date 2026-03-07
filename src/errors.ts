export type CsfloatErrorKind =
  | "validation"
  | "authentication"
  | "authorization"
  | "account_gated"
  | "role_gated"
  | "not_found"
  | "rate_limit"
  | "server"
  | "timeout"
  | "network"
  | "unknown";

export interface CsfloatSdkErrorOptions {
  status?: number;
  code?: string;
  details?: unknown;
  kind?: CsfloatErrorKind;
  retryable?: boolean;
  apiMessage?: string;
  cause?: unknown;
}

export class CsfloatSdkError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly details: unknown;
  readonly kind: CsfloatErrorKind;
  readonly retryable: boolean;
  readonly apiMessage: string | undefined;

  constructor(
    message: string,
    options: CsfloatSdkErrorOptions = {},
  ) {
    super(message);
    this.name = "CsfloatSdkError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.kind = options.kind ?? "unknown";
    this.retryable = options.retryable ?? false;
    this.apiMessage = options.apiMessage;

    if (options.cause !== undefined) {
      Object.defineProperty(this, "cause", {
        value: options.cause,
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }
  }
}

export function isCsfloatSdkError(error: unknown): error is CsfloatSdkError {
  return error instanceof CsfloatSdkError;
}
