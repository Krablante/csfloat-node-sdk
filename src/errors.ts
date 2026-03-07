export class CsfloatSdkError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly details: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; details?: unknown } = {},
  ) {
    super(message);
    this.name = "CsfloatSdkError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}
