import crypto from "crypto";

export const buildBrowserIdentifier = (headers: Headers) => {
  return headers.get("user-agent") ?? "unknown";
};

export function generateNonce(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}
