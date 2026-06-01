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

export default function MultiCursor({
  images,
  floatChatInterface,
  imageUpdate,
}: {
  images: React.RefObject<BoardImage[]>;
  floatChatInterface: boolean;
  imageUpdate: number;
}) {
  const camera = useRef({
    x: 0,
    y: 0,
    scale: 1,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const strokes = useRef<Stroke[]>([]);
  const currentStroke = useRef<Point[]>([]);
  const activeStrokes = useRef<Record<string, ActiveStroke>>({});

  //username userId
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const userIdRef = useRef("");

  const isDrawing = useRef(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  //getRoomId
  const { roomId } = useParams();
  const navigate = useNavigate();

  //image
  // Add this ref at the top
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  //colors work
  const color = COLORS[Math.floor(Math.random() * 5)];

  if(!roomId)return;


   //setup intial board
    useSocketBoard(
      roomId,
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

    //drawing
    useSocketDraw(
      roomId,
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
    );
    //zoom events
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

  //image updation code
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

  //basic setup
  useEffect(() => {
    if (!roomId) navigate("/dashboard");
    //get current username and userID
    socket.emit("my-info", (callback: { userId: string; name: string }) => {
      setUserName(callback.name);
      setUserId(callback.userId);
      userIdRef.current = callback.userId;
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

    if (!roomId) return;

   
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
