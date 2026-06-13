import { useEffect, useRef, useState } from "react";
import { socket } from "../../../services/socket";
import { useNavigate, useParams } from "react-router-dom";
const COLORS = ["#ff6b6b", "#4ecdc4", "#f9ca24", "#6c5ce7", "#55efc4"];
//helper function
import { getCanvasPoint, redraw } from "./canvas";
//types
import type { BoardImage, Stroke, Point, ActiveStroke } from "./types";
import { useSocketBoard } from "./hooks/useSocketBoard";
import { useSocketDraw } from "./hooks/useSocketDraw";
import { useCanvasZoom } from "./hooks/useCanvasZoom";
import { useImageTransform } from "./hooks/useImageTransform";

export default function MultiCursor({
  images,
  floatChatInterface,
  imageUpdate,
}: {
  images: React.RefObject<BoardImage[]>;
  floatChatInterface: boolean;
  imageUpdate: number;
}) {
  const camera = useRef({ x: 0, y: 0, scale: 1 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokes = useRef<Stroke[]>([]);
  const currentStroke = useRef<Point[]>([]);
  const activeStrokes = useRef<Record<string, ActiveStroke>>({});
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const userIdRef = useRef("");
  const isDrawing = useRef(false);
  const color = useRef(COLORS[Math.floor(Math.random() * 5)]).current;
  const selectedImgIdx=useRef<number>(-1)

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) navigate("/dashboard");
  }, [roomId]);

  useSocketBoard(
    roomId ?? "",
    canvasRef,
    camera,
    images,
    imageCache,
    activeStrokes,
    currentStroke,
    strokes,
    userIdRef,
    color,
  );
  useSocketDraw(
    roomId ?? "",
    canvasRef,
    camera,
    images,
    imageCache,
    activeStrokes,
    currentStroke,
    strokes,
    userIdRef,
    color,
    isDrawing,
    setCursorPos,
    selectedImgIdx
  );
  useCanvasZoom(
    canvasRef,
    camera,
    images,
    imageCache,
    activeStrokes,
    currentStroke,
    strokes,
    userIdRef,
    color,
  );

  //image transformations
  useImageTransform(canvasRef,
    camera,
    images,
    imageCache,
    activeStrokes,
    currentStroke,
    strokes,
    userIdRef,
    color,
    selectedImgIdx,
    roomId??""
  );

  useEffect(() => {
    socket.emit("my-info", (cb: { userId: string; name: string }) => {
      setUserName(cb.name);
      setUserId(cb.userId);
      userIdRef.current = cb.userId;
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.setTransform(
      camera.current.scale,
      0,
      0,
      camera.current.scale,
      camera.current.x,
      camera.current.y,
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    redraw(
      canvas,
      ctx,
      camera,
      images, 
      imageCache,
      activeStrokes,
      currentStroke,
      strokes,
      userIdRef.current,
      color,
    );
  }, [imageUpdate]);

  return (
    <div className="relative bg-black">
      <canvas ref={canvasRef} width={1000} height={600} />
      <div
        style={{
          position: "fixed",
          left: cursorPos.x - 5,
          top: cursorPos.y - 5,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "white",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
