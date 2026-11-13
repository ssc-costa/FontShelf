import type { CSSProperties } from "react";
import { useFontStore } from "../state/fontStore";

/** Shared by every live specimen, including the comparison and detail panels. */
export function usePreviewStyle(): CSSProperties {
  const options = useFontStore((s) => s.previewOptions);
  return {
    letterSpacing: `${options.tracking}em`,
    lineHeight: options.lineHeight,
    color: options.textColor ?? undefined,
    backgroundColor: options.backgroundColor ?? undefined,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  };
}
