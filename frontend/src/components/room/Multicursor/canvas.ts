import type React from "react";
import type { BoardImage, ActiveStroke, Point, Stroke } from "./types";

const getCanvasPoint = (
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  camera: React.RefObject<any>,
) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const screenX = (e.clientX - rect.left) * scaleX;
  const screenY = (e.clientY - rect.top) * scaleY;
  return {
    x: (screenX - camera.current.x) / camera.current.scale,

    y: (screenY - camera.current.y) / camera.current.scale,
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
) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(
    camera.current.scale,
    0,
    0,
    camera.current.scale,
    camera.current.x,
    camera.current.y,
  );

  for (const imageData of images.current) {
    const cached = imageCache.current.get(imageData.id);
    if (cached) {
          const centerX = imageData.x + imageData.width / 2;
      const centerY = imageData.y + imageData.height / 2;
      const rotation = imageData.rotation || 0;

      ctx.save();
      ctx.translate(centerX,centerY)
      ctx.rotate(rotation)



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
        );
      };

      img.src = imageData.image;
    }
  }

  // strokes on top
  const allActive = Object.entries(activeStrokes.current).map(
    ([userId, activeStroke]) => ({
      userId,
      color: activeStroke.color,
      points: activeStroke.points,
    }),
  );

  const allStrokes = [
    ...strokes.current,
    { userId, points: currentStroke.current, color },
    ...allActive,
  ];

  for (const stroke of allStrokes) {
    if (stroke.points.length === 0) continue;
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    stroke.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  }
};

const getSelectionLine = (
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

export { getCanvasPoint, redraw, getSelectionLine, isRotationHandlerClicked };
