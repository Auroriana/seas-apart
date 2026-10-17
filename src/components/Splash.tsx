export function Splash({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex h-full items-center justify-center" role="status" aria-live="polite">
      <p className="font-display text-xl text-sand-dim">{label}…</p>
    </div>
  );
}
