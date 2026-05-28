import { useEffect, useRef, useState } from "react";

export default function MultiCursor({
  floatChatInterface,
}: {
  floatChatInterface: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isDrawing = useRef(false);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    const startDrawing = (e: MouseEvent) => {
      isDrawing.current = true;

      ctx.beginPath();

      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      ctx.moveTo(x, y);
    };

    const draw = (e: MouseEvent) => {
      // move preview cursor
      setCursorPos({
        x: e.clientX,
        y: e.clientY,
      });

      if (!isDrawing.current) return;

      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing.current = false;
      ctx.closePath();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDrawing);
    };
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={900} height={600}></canvas>

      {/* fake cursor */}
      <div
        style={{
          position: "fixed",
          left: cursorPos.x - 5,
          top: cursorPos.y - 5,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "black",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}