import { useState } from "react";
import { Button } from "../../components/Button";

export function ShareCodeCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section aria-labelledby="your-code" className="rounded-2xl border border-deep-3 bg-deep-2 p-6">
      <h2 id="your-code" className="text-sm text-sand-dim">
        Your code. Send it to your partner.
      </h2>
      <p className="mt-3 select-all break-all font-display text-4xl tracking-[0.18em] text-glass" aria-label={`Your code is ${code.split("").join(" ")}`}>
        {code}
      </p>
      <Button variant="quiet" className="mt-5 w-full" onClick={copy}>
        {copied ? "Copied" : "Copy code"}
      </Button>
    </section>
  );
}
