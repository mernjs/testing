import React from "react";

/**
 * Splits a string on every "YashOrbit" occurrence and re-wraps each one in the
 * same two-tone treatment used for the logo wordmark (Yash in the surrounding
 * text color, Orbit in the brand accent). Strings without a match pass through
 * unchanged, so this is safe to call on any text.
 */
export function brandify(text: string): React.ReactNode {
  const parts = text.split(/(YashOrbit)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part === "YashOrbit" ? (
      <React.Fragment key={i}>
        <span className="text-foreground">Yash</span>
        <span className="text-primary">Orbit</span>
      </React.Fragment>
    ) : (
      part
    )
  );
}
