export interface SerializedError {
  message: string;
  code: string;
  stack?: string;
  metadata?: unknown;
}

export interface ErrorResponse {
  message: string;
  code: string;
}

export abstract class ErrorBase extends Error {
  constructor(readonly message: string, readonly metadata?: unknown) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract readonly code: string;

  toJSON(): SerializedError {
    return {
      message: this.message,
      code: this.code,
      stack: this.stack,
      metadata: this.metadata,
    };
  }

  unwrap(): ErrorResponse {
    return { message: this.message, code: this.code };
  }
}
