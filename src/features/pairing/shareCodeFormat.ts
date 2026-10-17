// Must match functions/src/shareCode.ts. Excludes 0, O, 1, I, L so codes are hard to misread.
export const SHARE_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const SHARE_CODE_LENGTH = 8;

/** Uppercases and drops anything that cannot appear in a code. */
export function cleanCodeInput(raw: string): string {
  return [...raw.toUpperCase()].filter((ch) => SHARE_CODE_ALPHABET.includes(ch)).join("").slice(0, SHARE_CODE_LENGTH);
}
