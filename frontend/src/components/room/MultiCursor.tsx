import { useEffect, useRef, useState } from "react";
import { socket } from "../../services/socket";

type Point = {
  x: number;
  y: number;
};

type Stroke = {
  userId: string;
  points: Point[];
};

export default function MultiCursor({
  floatChatInterface,
}: {
  floatChatInterface: boolean;
}) {
  const camera = useRef({
    x: 0,
    y: 0,
    scale: 1,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokes = useRef<Stroke[]>([]);
  const currentStroke = useRef<Point[]>([]);

  //username userId
  const [userName,setUserName]=useState("");
  const [userId,setUserId]=useState("")

  const isDrawing = useRef(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const getCanvasPoint = (e: MouseEvent, canvas: HTMLCanvasElement) => {
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

  useEffect(() => {
    //get current username and userID
    socket.emit("my-info",(callback:{userId:string,name:string})=>{
      setUserName(callback.name);
      setUserId(callback.userId);
    });

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    ctx.setTransform(
      camera.current.scale,
      0,
      0,
      camera.current.scale,
      camera.current.x,
      camera.current.y,
    );

    //handle drawing
    const startDrawing = (e: MouseEvent) => {
      isDrawing.current = true;
      const { x, y } = getCanvasPoint(e, canvas);
      currentStroke.current = [{ x, y }];
      redraw();
    };

    const draw = (e: MouseEvent) => {
      setCursorPos({
        x: e.clientX,
        y: e.clientY,
      });
      if (!isDrawing.current) return;
      const { x, y } = getCanvasPoint(e, canvas);
      currentStroke.current.push({ x, y });
      redraw();
    };

    //stop drawing
    const stopDrawing = () => {
      if (currentStroke.current.length > 0) {
        strokes.current.push({
          points: [...currentStroke.current],
          userId: userName,
        });
      }
      currentStroke.current = [];
      isDrawing.current = false;
      redraw();
    };

    //zoom out and in
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey) {
        const zoomAmount = e.deltaY * -0.001;
        const oldScale = camera.current.scale;
        const newScale = Math.min(Math.max(0.2, oldScale + zoomAmount), 5);

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // world position before zoom
        const worldX = (mouseX - camera.current.x) / oldScale;
        const worldY = (mouseY - camera.current.y) / oldScale;
        camera.current.scale = newScale;
        // adjust camera so mouse stays fixed
        camera.current.x = mouseX - worldX * newScale;
        camera.current.y = mouseY - worldY * newScale;
      } else if (e.shiftKey) {
        camera.current.x -= e.deltaY;
      } else {
        camera.current.y -= e.deltaY;
      }

      redraw();
    };

    const redraw = () => {
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

      const allStrokes = [
        ...strokes.current,
        { points: currentStroke.current, userId: userId },
      ];

      for (const stroke of allStrokes) {
        if (stroke.points.length === 0) continue;
        ctx.beginPath();
        stroke.points.forEach((p, i) => {
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        });

        ctx.stroke();
      }
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="relative bg-black">
      <canvas ref={canvasRef} width={1000} height={600}></canvas>

      {/* fake cursor */}
      <div
        style={{
          position: "fixed",
          left: cursorPos.x - 5,
          top: cursorPos.y - 5,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "white",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
