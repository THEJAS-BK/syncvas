import type { RefObject } from "react";
import type { Shape, Line, TextBox } from "../types";

export function getNextZIndex(
  shapesRef: RefObject<Shape[]>,
  linesRef: RefObject<Line[]>,
  textBoxesRef: RefObject<TextBox[]>,
) {
  const all = [
    ...shapesRef.current,
    ...linesRef.current,
    ...textBoxesRef.current,
  ];
  if (all.length === 0) return 0;
  return Math.max(...all.map((el) => el.zIndex ?? 0)) + 1;
}