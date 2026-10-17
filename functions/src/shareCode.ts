import { randomInt } from "node:crypto";

// Excludes 0, O, 1, I, L. Must match src/features/pairing/shareCodeFormat.ts in the app.
export const SHARE_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const SHARE_CODE_LENGTH = 8;

const SHARE_CODE_PATTERN = new RegExp(`^[${SHARE_CODE_ALPHABET}]{${SHARE_CODE_LENGTH}}$`);

export function generateShareCode(): string {
  let code = "";
  for (let i = 0; i < SHARE_CODE_LENGTH; i++) {
    code += SHARE_CODE_ALPHABET.charAt(randomInt(SHARE_CODE_ALPHABET.length));
  }
  return code;
}

/** Returns the cleaned code, or null if the input is not a valid code. */
export function normalizeShareCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toUpperCase();
  return SHARE_CODE_PATTERN.test(code) ? code : null;
}
