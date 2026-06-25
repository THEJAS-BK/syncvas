// ---- hit tests ----

import type { Shape, TextBox,Line } from "../types";

function hitTestShape(shape: Shape, x: number, y: number): boolean {
  const left = Math.min(shape.x, shape.x + shape.width);
  const top = Math.min(shape.y, shape.y + shape.height);
  const right = Math.max(shape.x, shape.x + shape.width);
  const bottom = Math.max(shape.y, shape.y + shape.height);

  switch (shape.shapeType) {
    case "square":
      return x >= left && x <= right && y >= top && y <= bottom;

    case "circle": {
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const rx = (right - left) / 2;
      const ry = (bottom - top) / 2;
      if (rx === 0 || ry === 0) return false;
      return (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 <= 1;
    }

    case "diamond": {
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const rx = (right - left) / 2;
      const ry = (bottom - top) / 2;
      if (rx === 0 || ry === 0) return false;
      return Math.abs(x - cx) / rx + Math.abs(y - cy) / ry <= 1;
    }
  }
}

function hitTestLine(line: Line, x: number, y: number, scale: number): boolean {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return false;

  const t = Math.max(
    0,
    Math.min(1, ((x - line.x1) * dx + (y - line.y1) * dy) / lenSq),
  );
  const closestX = line.x1 + t * dx;
  const closestY = line.y1 + t * dy;

  // tolerance of 6px in screen space → divide by scale to get canvas space
  return Math.hypot(x - closestX, y - closestY) < 6 / scale;
}

function hitTestTextBox(
  tb: TextBox,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D,
): boolean {
  ctx.font = `${tb.fontSize}px monospace`;
  const lines = tb.text.split("\n");
  const lineHeight = tb.fontSize * 1.2;
  const width = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const height = lines.length * lineHeight;
  return x >= tb.x && x <= tb.x + width && y >= tb.y && y <= tb.y + height;
}

export {hitTestLine,hitTestShape,hitTestTextBox}