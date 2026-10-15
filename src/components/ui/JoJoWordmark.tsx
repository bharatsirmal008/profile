import type { ReactNode } from "react";

/** Shared JoJo lettering for chat, desktop, mobile and voice interfaces. */
export function JoJoWordmark({ className = "", size = 28, children }: {
  className?: string; size?: number; children?: ReactNode;
}) {
  return <span className={className} style={{ fontFamily: '"Times New Roman", Georgia, serif', fontSize: size, fontWeight: 900, fontStyle: "normal", letterSpacing: "-0.04em", lineHeight: 1, textTransform: "none" }}>{children ?? "JoJo"}</span>;
}
