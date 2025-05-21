export async function hashPin(pin: string, nonce: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode([pin, nonce].join(""));

  const buffer = await window.crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(buffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
