import type { ReactNode } from "react";

export function Screen({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex min-h-full w-full max-w-md flex-col gap-8 px-6 py-10">{children}</main>;
}
