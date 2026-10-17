export function ErrorNotice({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl border border-flag/60 bg-deep-2 px-4 py-3 text-sm text-flag">
      {message}
    </p>
  );
}
