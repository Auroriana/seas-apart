import { useState, type FormEvent } from "react";
import { Button } from "../../components/Button";
import { ErrorNotice } from "../../components/ErrorNotice";
import { describeCallableError, pairWithCode } from "./pairingApi";
import { SHARE_CODE_LENGTH, cleanCodeInput } from "./shareCodeFormat";

export function PartnerCodeForm() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (code.length !== SHARE_CODE_LENGTH) {
      setError(`A code has ${SHARE_CODE_LENGTH} characters.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await pairWithCode(code);
      // On success the profile listener sees the new coupleId and the app moves on by itself.
    } catch (err) {
      console.error(err);
      setError(describeCallableError(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <label htmlFor="partner-code" className="text-sm text-sand-dim">
        Your partner's code
      </label>
      <input
        id="partner-code"
        value={code}
        onChange={(e) => setCode(cleanCodeInput(e.target.value))}
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={SHARE_CODE_LENGTH}
        placeholder="8 characters"
        className="min-h-14 rounded-xl border border-deep-3 bg-deep px-4 font-display text-2xl tracking-[0.18em] text-sand placeholder:text-base placeholder:tracking-normal placeholder:text-sand-dim"
      />
      {error && <ErrorNotice message={error} />}
      <Button type="submit" disabled={busy || code.length !== SHARE_CODE_LENGTH}>
        {busy ? "Pairing…" : "Pair up"}
      </Button>
    </form>
  );
}
