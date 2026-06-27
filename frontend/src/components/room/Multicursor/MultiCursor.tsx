import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../../../services/socket";
import { useNavigate, useParams } from "react-router-dom";
const COLORS = ["#ff6b6b", "#4ecdc4", "#f9ca24", "#6c5ce7", "#55efc4"];
//helper function
import { redraw } from "./canvas";
//types
import type {
  BoardImage,
  Stroke,
  Point,
  ActiveStroke,
  Shape,
  Line,
  TextBox,
} from "./types";
import { useSocketBoard } from "./hooks/useSocketBoard";
import { useSocketDraw } from "./hooks/useSocketDraw";
import { useCanvasZoom } from "./hooks/useCanvasZoom";
import { useImageTransform } from "./hooks/useImageTransform";
import { getCursorStyle } from "./tools/CustomCursor";
import { useTextBox } from "./hooks/useTextBox";
import { useHandTool } from "./hooks/useHandTool";
//tools
import { autoPanIfNeeded } from "./tools/autoPanTextBox";
import { useShapes } from "./hooks/useShape";
import { useLines } from "./hooks/useLines";
import { useSelection } from "./hooks/useSelection";
import { useDeleteElement } from "./hooks/useDeleteElement";
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

  const [filled, setFilled] = useState(false);

  const linesRef = useRef<Line[]>([]);
  const activeLine = useRef<Line | null>(null);

  const selectedId = useRef<string | null>(null);

  const textBoxesRef = useRef<TextBox[]>([]);
  const activeTextBox = useRef<TextBox | null>(null);

  const editingExistingRef = useRef(false);

  const [, forceUpdate] = useState(0);
  const triggerUpdate = () => forceUpdate((n) => n + 1);
  useSelection(
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
    linesRef,
    activeLine,
    selectedId,
    userIdRef,
    color,
    activeTool,
    textBoxesRef,
    activeTextBox,
    triggerUpdate,
    editingExistingRef,
  );
  const {
    placeTextBox,
    finalizeTextBox,
    cancelTextBox,
    updateTextBox,
    changeFontSize,
    deleteTextBox,
  } = useTextBox(
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
    userIdRef.current,
    color,
    filled,
    activeTool,
    linesRef,
    activeLine,
    selectedId,
    textBoxesRef,
    activeTextBox,
  );
  const hasTextElements =
    activeTextBox !== null || textBoxesRef.current.length > 0;

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
      triggerUpdate();
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
    linesRef,
    activeLine,
    selectedId,
    textBoxesRef,
    activeTextBox,
  );
  useHandTool(
    canvasRef,
    camera,
    images,
    imageCache,
    activeStrokes,
    currentStroke,
    strokes,
    shapesRef,
    activeShape,
    linesRef,
    activeLine,
    selectedId,
    textBoxesRef,
    activeTextBox,
    userIdRef,
    color,
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
    linesRef,
    activeLine,
    selectedId,
    textBoxesRef,
    activeTextBox,
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
    activeTool,
    linesRef,
    activeLine,
    selectedId,
    textBoxesRef,
    activeTextBox,
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
    linesRef,
    activeLine,
    selectedId,
    textBoxesRef,
    activeTextBox,
  );

  //image transformations
  // useImageTransform(
  //   canvasRef,
  //   camera,
  //   images,
  //   imageCache,
  //   activeStrokes,
  //   currentStroke,
  //   strokes,
  //   userIdRef,
  //   color,
  //   selectedImgIdx,
  //   roomId ?? "",
  //   shapesRef,
  //   activeShape,
  //   linesRef,
  //   activeLine,
  //   selectedId,
  //   textBoxesRef,
  //   activeTextBox,
  // );

  useLines(
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
    linesRef,
    activeLine,
    userIdRef,
    color,
    activeTool,
    selectedId,
    textBoxesRef,
    activeTextBox,
  );

  useDeleteElement(
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
    linesRef,
    activeLine,
    selectedId,
    textBoxesRef,
    activeTextBox,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    socket.emit("my-info", (cb: { userId: string; name: string }) => {
      setUserName(cb.name);
      setUserId(cb.userId);
      userIdRef.current = cb.userId;
    });
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
      linesRef,
      activeLine,
      selectedId,
      textBoxesRef,
      activeTextBox,
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
      <canvas
        ref={canvasRef}
        className="bg-gray-700"
        style={{
          cursor: getCursorStyle(activeTool),
          overscrollBehavior: "none",
          overflow: "hidden",
        }}
        defaultValue={activeTextBox.current?.text ?? ""}
        onClick={handleCanvasClick}
      />

      {/* active textarea overlay */}
      {activeTextBox.current && (
        <>
          <span
            ref={measureRef}
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "pre",
              fontSize: activeTextBox.current.fontSize * camera.current.scale,
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
              color: "transparent",
              caretColor: activeTextBox.current.color,
              position: "absolute",
              left:
                activeTextBox.current.x * camera.current.scale +
                camera.current.x,
              top:
                activeTextBox.current.y * camera.current.scale +
                camera.current.y,

              border: "none",
              outline: "none",

              fontSize: activeTextBox.current.fontSize * camera.current.scale,
              fontFamily: "monospace",
              fontWeight: "normal",
              resize: "none",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              width: "20px",
              height: `${activeTextBox.current.fontSize * camera.current.scale + 6}px`,
              padding: 0,
              margin: 0,
              boxSizing: "border-box" as const,
              lineHeight: `${activeTextBox.current.fontSize * camera.current.scale * 1.4}px`,
              verticalAlign: "top",

              background: "transparent",
            }}
            onInput={(e) => {
              activeTextBox.current!.text = e.currentTarget.value;
              const el = e.currentTarget;
              const measure = measureRef.current!;
              const scale = camera.current.scale;

              // sync text to ref so canvas redraws it
              activeTextBox.current!.text = el.value;

              const lines = el.value.split("\n");
              const longest = lines.reduce(
                (a, b) => (a.length > b.length ? a : b),
                "",
              );
              measure.textContent = longest || " ";
              measure.style.fontSize = `${activeTextBox.current!.fontSize * scale}px`;
              measure.style.fontFamily = "monospace";

              const naturalWidth = measure.offsetWidth + 20;
              const leftPos =
                activeTextBox.current!.x * scale + camera.current.x;
              const maxAllowed = window.innerWidth - leftPos - 20;

              el.style.width =
                Math.min(naturalWidth, Math.max(maxAllowed, 20)) + "px";
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";

              // redraw canvas with updated text
              const canvas = canvasRef.current;
              const ctx = canvas?.getContext("2d");
              if (canvas && ctx) {
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
                  linesRef,
                  activeLine,
                  selectedId,
                  textBoxesRef,
                  activeTextBox,
                );

                // pan if needed
                const rect = el.getBoundingClientRect();
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
                  linesRef,
                  activeLine,
                  selectedId,
                  textBoxesRef,
                  activeTextBox,
                );
              }
            }}
            onBlur={(e) => {
              const isEdit =
                !!activeTextBox.current &&
                textBoxesRef.current.some(
                  (t) => t.id === activeTextBox.current?.id,
                ) === false &&
                editingExistingRef.current;
              finalizeTextBox(e.target.value, editingExistingRef.current);
              editingExistingRef.current = false;
              triggerUpdate();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                cancelTextBox();
                triggerUpdate();
              }
            }}
          />
        </>
      )}
    </div>
  );
}
