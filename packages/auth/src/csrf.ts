/**
 * Validate the Origin header against a list of allowed origins.
 * If no Origin header is present, the request is allowed — same-origin
 * requests from some browsers omit it, and SameSite=Lax cookies already
 * prevent cross-origin cookie attachment for POST requests.
 */
export function validateOrigin(
  requestOrigin: string | null,
  allowedOrigins: string[],
): boolean {
  if (!requestOrigin) return true;
  return allowedOrigins.some((allowed) => requestOrigin === allowed);
}
