import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const MIN_SCALE = 0.2;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.1;

export default function ZoomControls({
  canvasRef,
  camera,
  doRedraw,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  camera: React.RefObject<{ x: number; y: number; scale: number }>;
  doRedraw: () => void;
}) {
  const [, forceUpdate] = useState(0);

  const zoomBy = (delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const oldScale = camera.current.scale;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale + delta));
    if (newScale === oldScale) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const worldX = (centerX - camera.current.x) / oldScale;
    const worldY = (centerY - camera.current.y) / oldScale;

    camera.current.scale = newScale;
    camera.current.x = centerX - worldX * newScale;
    camera.current.y = centerY - worldY * newScale;

    doRedraw();
    forceUpdate((n) => n + 1);
  };

  const zoomIn = () => zoomBy(ZOOM_STEP);
  const zoomOut = () => zoomBy(-ZOOM_STEP);

  const percentage = Math.round(camera.current.scale * 100);

  return (
    <div className=" absolute bottom-3 left-5.5 flex items-center gap-1 bg-black border-2 border-grayscale-25 rounded text-white shadow-lg p-1">
      <button
        onClick={zoomOut}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30"
        disabled={camera.current.scale <= MIN_SCALE}
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-12 text-center text-sm tabular-nums select-none">
        {percentage}%
      </span>

      <button
        onClick={zoomIn}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30"
        disabled={camera.current.scale >= MAX_SCALE}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}