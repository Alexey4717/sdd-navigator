// @req SCD-API-003
// Typed error handling: expected failures are returned as a Result value,
// never thrown. Kinds: network failure, missing resource, malformed payload,
// or a non-ok HTTP response.

export type ApiErrorKind = 'network' | 'not_found' | 'malformed' | 'http';

export interface ApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError };

// @req SCD-API-003
export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

// @req SCD-API-003
export function err<T = never>(
  kind: ApiErrorKind,
  message: string,
  status?: number,
): Result<T> {
  const error: ApiError =
    status === undefined ? { kind, message } : { kind, message, status };
  return { ok: false, error };
}
