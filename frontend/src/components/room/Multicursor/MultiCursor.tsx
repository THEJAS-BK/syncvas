import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../../../services/socket";
import { useNavigate, useParams } from "react-router-dom";
const COLORS = ["#ff6b6b", "#4ecdc4", "#f9ca24", "#6c5ce7", "#55efc4"];
//helper function
import { redraw } from "./canvas";
//types
import type { BoardImage, Stroke, Point, ActiveStroke, Shape } from "./types";
import { useSocketBoard } from "./hooks/useSocketBoard";
import { useSocketDraw } from "./hooks/useSocketDraw";
import { useCanvasZoom } from "./hooks/useCanvasZoom";
import { useImageTransform } from "./hooks/useImageTransform";
import { getCursorStyle } from "./tools/CustomCursor";
import { useTextBox } from "./hooks/useTextBox";
//tools
import { autoPanIfNeeded } from "./tools/autoPanTextBox";
import { useShapes } from "./hooks/useShape";

export default function MultiCursor({
  images,
  floatChatInterface,
  imageUpdate,
  eraserRef,
  activeTool,
}: {
  images: React.RefObject<BoardImage[]>;
  floatChatInterface: boolean;
  imageUpdate: number;
  eraserRef: React.MutableRefObject<boolean>;
  activeTool: string | null;
}) {
  const camera = useRef({ x: 0, y: 0, scale: 1 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const strokes = useRef<Stroke[]>([]);
  const currentStroke = useRef<Point[]>([]);
  const activeStrokes = useRef<Record<string, ActiveStroke>>({});
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const userIdRef = useRef("");
  const isDrawing = useRef(false);
  const color = useRef(COLORS[Math.floor(Math.random() * 5)]).current;
  const selectedImgIdx = useRef<number>(-1);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const { roomId } = useParams();
  const navigate = useNavigate();

  const measureRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [panTick, setPanTick] = useState(0);
  const shapesRef = useRef<Shape[]>([]);
  const activeShape = useRef<Shape | null>(null);

  const [filled,setFilled]=useState(false)

  const {
    textBoxes,
    activeTextBox,
    placeTextBox,
    finalizeTextBox,
    cancelTextBox,
    updateTextBox,
    changeFontSize,
    deleteTextBox,
  } = useTextBox(roomId ?? "", camera, userIdRef, color);

  const hasTextElements = activeTextBox !== null || textBoxes.length > 0;

  // stable callback so useCanvasZoom's effect doesn't tear down/reattach every render
  const handleCameraChange = useCallback(() => {
    if (hasTextElements) setPanTick((t) => t + 1);
  }, [hasTextElements]);

  useEffect(() => {
    if (!roomId) navigate("/dashboard");
  }, [roomId]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "text") {
      placeTextBox(e.clientX, e.clientY);
    }
  };

  useShapes(
  roomId ?? "",
  canvasRef,
  camera,
  images,
  imageCache,
  activeStrokes,
  currentStroke,
  strokes,
  shapesRef,
  activeShape,
  userIdRef,
  color,
  filled,
  activeTool,
);

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
    shapesRef,
    activeShape,
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
    selectedImgIdx,
    eraserRef,
    shapesRef,
    activeShape,
    activeTool
  );
  useCanvasZoom(
    wrapperRef,
    canvasRef,
    camera,
    images,
    imageCache,
    activeStrokes,
    currentStroke,
    strokes,
    userIdRef,
    color,
    handleCameraChange,
    shapesRef,
    activeShape,
  );

  //image transformations
  useImageTransform(
    canvasRef,
    camera,
    images,
    imageCache,
    activeStrokes,
    currentStroke,
    strokes,
    userIdRef,
    color,
    selectedImgIdx,
    roomId ?? "",
    shapesRef,
    activeShape,
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
      shapesRef,
      activeShape,
    );
  }, [imageUpdate]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        touchAction: "none",
        overscrollBehavior: "none",
        width: "100%",
        height: "100%",
      }}
    >
      {activeTool&&activeTool}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className={`bg-gray-700 `}  
        style={{
          cursor: getCursorStyle(activeTool),
          overscrollBehavior: "none",
          overflow: "hidden",
        }}
        onClick={handleCanvasClick}
      />

      {/* render finalized textboxes */}
      {textBoxes.map((box) => (
        <div
          key={box.id}
          style={{
            position: "absolute",
            left: box.x * camera.current.scale + camera.current.x,
            top: box.y * camera.current.scale + camera.current.y,
            color: box.color,
            fontSize: box.fontSize * camera.current.scale,
            pointerEvents: "none",
            whiteSpace: "pre",
          }}
        >
          {box.text}
        </div>
      ))}

      {/* active textarea overlay */}
      {activeTextBox && (
        <>
          <span
            ref={measureRef}
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "pre",
              fontSize: activeTextBox.fontSize * camera.current.scale,
              fontFamily: "monospace",
              top: -9999,
            }}
          />
          <textarea
            ref={textareaRef}
            autoFocus
            rows={1}
            spellCheck={false}
            style={{
              position: "absolute",
              left: activeTextBox.x * camera.current.scale + camera.current.x,
              top: activeTextBox.y * camera.current.scale + camera.current.y,
              background: "transparent",
              border: "none",
              outline: "none",
              color: activeTextBox.color,
              fontSize: activeTextBox.fontSize * camera.current.scale,
              fontFamily: "monospace",
              resize: "none",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              width: "20px",
              height: `${activeTextBox.fontSize * camera.current.scale + 6}px`,
              lineHeight: 1.4,
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              const measure = measureRef.current!;
              const scale = camera.current.scale;

              const lines = el.value.split("\n");
              const longest = lines.reduce(
                (a, b) => (a.length > b.length ? a : b),
                "",
              );
              measure.textContent = longest || " ";
              measure.style.fontSize = `${activeTextBox.fontSize * scale}px`;

              const naturalWidth = measure.offsetWidth + 20;
              const leftPos = activeTextBox.x * scale + camera.current.x;
              const maxAllowed = window.innerWidth - leftPos - 20;

              el.style.width =
                Math.min(naturalWidth, Math.max(maxAllowed, 20)) + "px";
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";

              // check overflow against viewport and pan camera
              const rect = el.getBoundingClientRect();
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext("2d");
              if (canvas && ctx) {
                autoPanIfNeeded(
                  canvas,
                  ctx,
                  camera,
                  rect.right,
                  rect.bottom,
                  images,
                  imageCache,
                  activeStrokes,
                  currentStroke,
                  strokes,
                  userIdRef.current,
                  color,
                  () => setPanTick((t) => t + 1),
                  shapesRef,
                  activeShape,
                );
              }
            }}
            onBlur={(e) => finalizeTextBox(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancelTextBox()}
          />
        </>
      )}
    </div>
  );
}
