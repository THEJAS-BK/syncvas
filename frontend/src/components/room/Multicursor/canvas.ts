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
      ctx.drawImage(
        cached,
        imageData.x,
        imageData.y,
        imageData.width,
        imageData.height,
      );
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


export {getCanvasPoint,redraw}