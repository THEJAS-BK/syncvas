import type React from "react";
import type {
  BoardImage,
  ActiveStroke,
  Point,
  Stroke,
  Shape,
  Line,
  TextBox,
} from "./types";

const getCanvasPoint = (
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  camera: React.RefObject<any>,
) => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const screenX = (e.clientX - rect.left) * dpr;
  const screenY = (e.clientY - rect.top) * dpr;
  return {
    x: (screenX - camera.current.x * dpr) / (camera.current.scale * dpr),
    y: (screenY - camera.current.y * dpr) / (camera.current.scale * dpr),
  };
};

//redraw
const redraw = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  camera: React.RefObject<any>,
  images: React.RefObject<BoardImage[]>,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: React.RefObject<Record<string, ActiveStroke>>,
  currentStroke: React.RefObject<Point[]>,
  strokes: React.RefObject<Stroke[]>,
  userId: string,
  color: string,
  shapesRef: React.RefObject<Shape[]>,
  activeShape: React.RefObject<Shape | null>,
  linesRef: React.RefObject<Line[]>,
  activeLine: React.RefObject<Line | null>,
  selectedId: React.RefObject<string | null>,
  textBoxesRef: React.RefObject<TextBox[]>,
  activeTextBox: React.RefObject<TextBox | null>,
  strokeWidth:number,
  opacity:number,
  fillColor:string

) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(
    camera.current.scale * dpr,
    0,
    0,
    camera.current.scale * dpr,
    camera.current.x * dpr,
    camera.current.y * dpr,
  );

  for (const imageData of images.current) {
    const cached = imageCache.current.get(imageData.id);
    if (cached) {
      const centerX = imageData.x + imageData.width / 2;
      const centerY = imageData.y + imageData.height / 2;
      const rotation = imageData.rotation || 0;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      ctx.drawImage(
        cached,
        -imageData.width / 2,
        -imageData.height / 2,
        imageData.width,
        imageData.height,
      );

      ctx.restore();
    } else {
      const img = new Image();
      img.onload = () => {
        imageCache.current.set(imageData.id, img);

        redraw(
          canvas,
          ctx,
          camera,
          images,
          imageCache,
          activeStrokes,
          currentStroke,
          strokes,
          userId,
          color,
          shapesRef,
          activeShape,
          linesRef,
          activeLine,
          selectedId,
          textBoxesRef,
          activeTextBox,
          strokeWidth,
          opacity,
          fillColor
        );
      };

      img.src = imageData.image;
    }
  }
  //shapes
  if (shapesRef?.current) {
    shapesRef.current.forEach((shape) => drawShape(ctx, shape));
  }
  if (activeShape?.current) {
    drawShape(ctx, activeShape.current);
  }
  // lines
  if (linesRef?.current) {
    linesRef.current.forEach((line) => drawLine(ctx, line));
  }
  if (activeLine?.current) {
    drawLine(ctx, activeLine.current);
  }
  // strokes on top
  const allActive = Object.entries(activeStrokes.current).map(
    ([userId, activeStroke]) => ({
      userId,
      color: activeStroke.color,
      strokeWidth:activeStroke.strokeWidth,
      opacity: activeStroke.opacity,
      points: activeStroke.points,
    }),
  );

  const allTextBoxes = [
    ...(textBoxesRef?.current ?? []).filter(
      (tb) => tb.id !== activeTextBox?.current?.id,
    ),
    ...(activeTextBox?.current ? [activeTextBox.current] : []),
  ];

  const allStrokes = [
    ...strokes.current,
    { userId, points: currentStroke.current, color,strokeWidth,opacity },
    ...allActive,
  ];

for (const stroke of allStrokes) {
  if (stroke.points.length === 0) continue;
  ctx.save();
  ctx.globalAlpha = (stroke.opacity ?? 100) / 100;
  ctx.beginPath();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.strokeWidth ?? 4;
  stroke.points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.restore();
}

 for (const tb of allTextBoxes) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  
  const lines = tb.text.split("\n");
  const lineHeight = tb.fontSize * 1.4;
  const width = Math.max(...lines.map(l => {
    ctx.font = `normal ${tb.fontSize}px monospace`;
    return ctx.measureText(l).width;
  }));
  const height = lines.length * lineHeight;
  
  // rotate around textbox center
  const cx = tb.x + width / 2;
  const cy = tb.y + height / 2;
  ctx.translate(cx, cy);
  ctx.rotate(tb.rotation || 0);
  ctx.translate(-cx, -cy);

  ctx.font = `normal ${tb.fontSize}px monospace`;
  ctx.fillStyle = tb.color;
  lines.forEach((line, i) => {
    ctx.fillText(line, tb.x, tb.y + tb.fontSize + i * lineHeight);
  });

  ctx.restore();
}

  //selection
  // ---- selection indicators ----
  if (selectedId?.current) {
    const id = selectedId.current;
    const scale = camera.current.scale;
    

    const drawSelectionBox = (
      left: number,
      top: number,
      right: number,
      bottom: number,
      rotation = 0,
      cx = (left + right) / 2,
      cy = (top + bottom) / 2,
    ) => {
      const w = right - left;
      const h = bottom - top;
      const PAD = 6 / scale;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // outline
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2 / scale;
      ctx.setLineDash([]);
      ctx.strokeRect(-w / 2 - PAD, -h / 2 - PAD, w + PAD * 2, h + PAD * 2);

      // rotation handle
      ctx.beginPath();
      ctx.arc(0, -h / 2 - PAD - 20 / scale, 8 / scale, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2 / scale;
      ctx.stroke();

      // corner handles
      const corners = [
        { x: -w / 2 - PAD, y: -h / 2 - PAD },
        { x: w / 2 + PAD, y: -h / 2 - PAD },
        { x: -w / 2 - PAD, y: h / 2 + PAD },
        { x: w / 2 + PAD, y: h / 2 + PAD },
      ];
      const hs = 5 / scale;
      corners.forEach((c) => {
        ctx.beginPath();
        ctx.rect(c.x - hs, c.y - hs, hs * 2, hs * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "blue";
        ctx.stroke();
      });

      ctx.restore();
    };

    const selectedShape = shapesRef?.current?.find((s) => s.id === id);
    if (selectedShape) {
      const left = Math.min(
        selectedShape.x,
        selectedShape.x + selectedShape.width,
      );
      const top = Math.min(
        selectedShape.y,
        selectedShape.y + selectedShape.height,
      );
      const right = Math.max(
        selectedShape.x,
        selectedShape.x + selectedShape.width,
      );
      const bottom = Math.max(
        selectedShape.y,
        selectedShape.y + selectedShape.height,
      );
      drawSelectionBox(left, top, right, bottom, selectedShape.rotation || 0);
    }

    const selectedLine = linesRef?.current?.find((l) => l.id === id);
    if (selectedLine) {
      ctx.save();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2 / scale;
      ctx.setLineDash([]);

      // endpoint handles
      for (const pt of [
        { x: selectedLine.x1, y: selectedLine.y1 },
        { x: selectedLine.x2, y: selectedLine.y2 },
      ]) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5 / scale, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
      }

      // center handle — sits on the curve at t=0.5
      const handleX =
        selectedLine.cpx !== undefined
          ? 0.25 * selectedLine.x1 +
            0.5 * selectedLine.cpx +
            0.25 * selectedLine.x2
          : (selectedLine.x1 + selectedLine.x2) / 2;
      const handleY =
        selectedLine.cpy !== undefined
          ? 0.25 * selectedLine.y1 +
            0.5 * selectedLine.cpy +
            0.25 * selectedLine.y2
          : (selectedLine.y1 + selectedLine.y2) / 2;
      ctx.beginPath();
      ctx.arc(handleX, handleY, 5 / scale, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    const selectedText = textBoxesRef?.current?.find((t) => t.id === id);
    if (selectedText) {
      ctx.font = `${selectedText.fontSize}px monospace`;
      const lines = selectedText.text.split("\n");
      const lineHeight = selectedText.fontSize * 1.4;
      const width = Math.max(...lines.map((l) => ctx.measureText(l).width));
      const height = lines.length * lineHeight;
      drawSelectionBox(
        selectedText.x,
        selectedText.y,
        selectedText.x + width,
        selectedText.y + height,
            selectedText.rotation || 0, 
      );
    }
  }
};

const getSelectionLineForImage = (
  ctx: CanvasRenderingContext2D,
  images: React.RefObject<BoardImage[]>,
  selectedImageIdx: number,
) => {
  if (selectedImageIdx != null) {
    const image = images.current[selectedImageIdx];

    if (image) {
      const centerX = image.x + image.width / 2;
      const centerY = image.y + image.height / 2;
      const rotation = image.rotation || 0;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        -image.width / 2,
        -image.height / 2,
        image.width,
        image.height,
      );

      const handleX = 0;
      const handleY = -image.height / 2 - 20;

      ctx.beginPath();
      ctx.arc(handleX, handleY, 8, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = "blue";
      ctx.stroke();

      const corners = [
        { x: -image.width / 2, y: -image.height / 2 }, // top-left
        { x: image.width / 2, y: -image.height / 2 }, // top-right
        { x: -image.width / 2, y: image.height / 2 }, // bottom-left
        { x: image.width / 2, y: image.height / 2 }, // bottom-right
      ];

      corners.forEach((corner) => {
        ctx.beginPath();
        ctx.rect(corner.x - 5, corner.y - 5, 10, 10);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "blue";
        ctx.stroke();
      });

      ctx.restore();
    }
  }
};

const isRotationHandlerClicked = (image: BoardImage, point: Point): boolean => {
  const centerX = image.x + image.width / 2;
  const centerY = image.y + image.height / 2;
  const rotation = image.rotation || 0;

  const dx = point.x - centerX;
  const dy = point.y - centerY;

  const localX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
  const localY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

  const handleLocalX = 0;
  const handleLocalY = -image.height / 2 - 20;

  const ddx = localX - handleLocalX;
  const ddy = localY - handleLocalY;

  return ddx * ddx + ddy * ddy <= 10 * 10;
};

const getClickedResizeHandle = (
  image: BoardImage,
  point: Point,
): "top-left" | "top-right" | "bottom-left" | "bottom-right" | null => {
  const centerX = image.x + image.width / 2;
  const centerY = image.y + image.height / 2;
  const rotation = image.rotation || 0;

  const dx = point.x - centerX;
  const dy = point.y - centerY;

  // undo rotation -> click point in local coordinates
  const localX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
  const localY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

  const corners: {
    name: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    x: number;
    y: number;
  }[] = [
    { name: "top-left", x: -image.width / 2, y: -image.height / 2 },
    { name: "top-right", x: image.width / 2, y: -image.height / 2 },
    { name: "bottom-left", x: -image.width / 2, y: image.height / 2 },
    { name: "bottom-right", x: image.width / 2, y: image.height / 2 },
  ];

  for (const corner of corners) {
    const ddx = localX - corner.x;
    const ddy = localY - corner.y;
    if (ddx * ddx + ddy * ddy <= 8 * 8) {
      return corner.name;
    }
  }

  return null;
};

const isPointNearStroke = (
  point: Point,
  stroke: Stroke,
  threshold = 10,
): boolean => {
  for (const p of stroke.points) {
    const dx = p.x - point.x;
    const dy = p.y - point.y;
    if (dx * dx + dy * dy <= threshold * threshold) {
      return true;
    }
  }
  return false;
};

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape, ) {
  const left = Math.min(shape.x, shape.x + shape.width);
  const top = Math.min(shape.y, shape.y + shape.height);
  const right = Math.max(shape.x, shape.x + shape.width);
  const bottom = Math.max(shape.y, shape.y + shape.height);
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  const w = right - left;
  const h = bottom - top;
  const rotation = shape.rotation || 0;

  const shouldFill = shape.fillColor !== "transparent";

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = 2;

  switch (shape.shapeType) {
    case "square":
      if (shouldFill) {
        ctx.fillStyle = shape.fillColor;
        ctx.fillRect(-w / 2, -h / 2, w, h);
      }
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      break;

    case "circle":
      ctx.beginPath();
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
      if (shouldFill) {
        ctx.fillStyle = shape.fillColor;
        ctx.fill();
      }
      ctx.stroke();
      break;

    case "diamond": {
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(w / 2, 0);
      ctx.lineTo(0, h / 2);
      ctx.lineTo(-w / 2, 0);
      ctx.closePath();
      if (shouldFill) {
        ctx.fillStyle = shape.fillColor;
        ctx.fill();
      }
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}
function drawLine(ctx: CanvasRenderingContext2D, line: Line) {
  ctx.strokeStyle = line.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(line.x1, line.y1);

  if (line.cpx !== undefined && line.cpy !== undefined) {
    ctx.quadraticCurveTo(line.cpx, line.cpy, line.x2, line.y2);
  } else {
    ctx.lineTo(line.x2, line.y2);
  }
  ctx.stroke();

  if (line.lineType === "arrow") {
    const angle =
      line.cpx !== undefined && line.cpy !== undefined
        ? Math.atan2(line.y2 - line.cpy, line.x2 - line.cpx)
        : Math.atan2(line.y2 - line.y1, line.x2 - line.x1);

    const headLength = 12;
    ctx.beginPath();
    ctx.moveTo(line.x2, line.y2);
    ctx.lineTo(
      line.x2 - headLength * Math.cos(angle - Math.PI / 6),
      line.y2 - headLength * Math.sin(angle - Math.PI / 6),
    );
    ctx.moveTo(line.x2, line.y2);
    ctx.lineTo(
      line.x2 - headLength * Math.cos(angle + Math.PI / 6),
      line.y2 - headLength * Math.sin(angle + Math.PI / 6),
    );
    ctx.stroke();
  }
}

function hitTestCorner(
  shape: Shape,
  x: number,
  y: number,
  scale: number,
): "tl" | "tr" | "bl" | "br" | null {
  const left = Math.min(shape.x, shape.x + shape.width);
  const top = Math.min(shape.y, shape.y + shape.height);
  const right = Math.max(shape.x, shape.x + shape.width);
  const bottom = Math.max(shape.y, shape.y + shape.height);
  const w = right - left;
  const h = bottom - top;
  const PAD = 6 / scale;

  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;

  const rotation = shape.rotation || 0; // ← use actual rotation
  const dx = x - centerX;
  const dy = y - centerY;
  const localX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
  const localY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

  const corners: { name: "tl" | "tr" | "bl" | "br"; x: number; y: number }[] = [
    { name: "tl", x: -w / 2 - PAD, y: -h / 2 - PAD },
    { name: "tr", x: w / 2 + PAD, y: -h / 2 - PAD },
    { name: "bl", x: -w / 2 - PAD, y: h / 2 + PAD },
    { name: "br", x: w / 2 + PAD, y: h / 2 + PAD },
  ];

  const hitRadius = (8 / scale) * (8 / scale);
  for (const corner of corners) {
    const ddx = localX - corner.x;
    const ddy = localY - corner.y;
    if (ddx * ddx + ddy * ddy <= hitRadius) {
      return corner.name;
    }
  }
  return null;
}

function hitTestRotationHandle(
  shape: Shape,
  x: number,
  y: number,
  scale: number,
): boolean {
  const left = Math.min(shape.x, shape.x + shape.width);
  const top = Math.min(shape.y, shape.y + shape.height);
  const right = Math.max(shape.x, shape.x + shape.width);
  const bottom = Math.max(shape.y, shape.y + shape.height);
  const PAD = 6 / scale;

  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const rotation = shape.rotation || 0;
  const hh = (bottom - top) / 2 + PAD;

  const dx = x - centerX;
  const dy = y - centerY;
  const localX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
  const localY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

  const handleX = 0;
  const handleY = -hh - 20 / scale;

  const ddx = localX - handleX;
  const ddy = localY - handleY;
  return ddx * ddx + ddy * ddy <= (10 / scale) * (10 / scale);
}
function hitTestTextBoxRotationHandle(
  tb: TextBox,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D,
  scale: number,
): boolean {
  ctx.font = `normal ${tb.fontSize}px monospace`;
  const lines = tb.text.split("\n");
  const lineHeight = tb.fontSize * 1.4;
  const width = Math.max(...lines.map(l => ctx.measureText(l).width));
  const height = lines.length * lineHeight;
  const PAD = 6 / scale;

  const centerX = tb.x + width / 2;
  const centerY = tb.y + height / 2;
  const rotation = tb.rotation || 0;
  const hh = height / 2 + PAD;

  const dx = x - centerX;
  const dy = y - centerY;
  const localX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
  const localY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

  const ddx = localX - 0;
  const ddy = localY - (-hh - 20 / scale);
  return ddx * ddx + ddy * ddy <= (10 / scale) * (10 / scale);
}

export {
  getCanvasPoint,
  redraw,
  getSelectionLineForImage,
  isRotationHandlerClicked,
  getClickedResizeHandle,
  isPointNearStroke,
  drawShape,
  drawLine,
  hitTestCorner,
  hitTestRotationHandle,
  hitTestTextBoxRotationHandle
};
