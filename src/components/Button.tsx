import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet" | "danger";

const styles: Record<Variant, string> = {
  primary: "bg-buoy text-deep font-semibold hover:brightness-105 disabled:opacity-50",
  quiet: "border border-deep-3 text-sand hover:bg-deep-2 disabled:opacity-50",
  danger: "border border-flag text-flag hover:bg-deep-2 disabled:opacity-50",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`min-h-12 rounded-xl px-5 text-base transition-colors ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
