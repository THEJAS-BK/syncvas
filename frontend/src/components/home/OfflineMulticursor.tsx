import { useCallback, useEffect, useRef, useState } from "react";
const COLORS = ["#1f2937", "#f87171", "#22c55e", "#3b82f6", "#d97706"];
//helper function
import { redraw } from "../room/Multicursor/canvas";

//types
import type {
  BoardImage,
  Stroke,
  Point,
  ActiveStroke,
} from "../room/Multicursor/types";
//tools
import { autoPanIfNeeded } from "../room/Multicursor/tools/autoPanTextBox";
import { useToolSettings } from "../../context/ToolBarLeftContext";
import { getCursorStyle } from "../room/Multicursor/tools/CustomCursor";
//hooks
import { useOfflineCanvasZoom } from "./hooks/useOfflineCanvasZoom";
import { useOfflineEraser } from "./hooks/useOfflineEraser";
import { useOfflineHandTool } from "./hooks/useOfflineHandTool";
import { useOfflineImageTransform } from "./hooks/useOfflineImageTransform";
import { useOfflineSelection } from "./hooks/useOfflineSelection";
import { useOfflineTextBox } from "./hooks/useOfflineTextBox";
import { useOfflineShapes } from "./hooks/useOfflineShape";
import { useOfflineDraw } from "./hooks/useOfflineDraw";
import { useOfflineLines } from "./hooks/useOfflineLines";
import { useOfflineDeleteElement } from "./hooks/useOfflineDeleteElement";

export default function OfflineMultiCursor({}: {}) {
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
  const measureRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [panTick, setPanTick] = useState(0);

  const editingExistingRef = useRef(false);

  const [, forceUpdate] = useState(0);
  const triggerUpdate = () => forceUpdate((n) => n + 1);

  const images = useRef<BoardImage[]>([]);
  useEffect(() => {
    setIsOffline(true);
  }, []);
  
  //shapes,textBoxes and lines
  const {
    shapesRef,
    activeShape,
    textBoxesRef,
    activeTextBox,
    linesRef,
    activeLine,
    doRedrawRef,
    strokeWidth,
    opacity,
    fillColor,
    strokeColor,
    setStrokeColor,
    activeTool,
    selectedId,
    setIsOffline,
  } = useToolSettings();

  useEffect(() => {
    setStrokeColor(color);
  }, []);

  const doRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
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
      strokeColor,
      shapesRef,
      activeShape,
      linesRef,
      activeLine,
      selectedId,
      textBoxesRef,
      activeTextBox,
      strokeWidth,
      opacity,
      fillColor,
    );
  }, [strokeColor, strokeWidth, opacity, fillColor]);

  useEffect(() => {
    doRedrawRef.current = doRedraw;
  }, [doRedraw]);

  useOfflineSelection(
    canvasRef,
    camera,
    shapesRef,
    linesRef,
    selectedId,
    strokeColor,
    activeTool,
    textBoxesRef,
    activeTextBox,
    triggerUpdate,
    doRedraw,
  );

  const { placeTextBox, finalizeTextBox, updateTextBoxContent } =
    useOfflineTextBox(
      camera,
      userIdRef.current,
      strokeColor,
      textBoxesRef,
      activeTextBox,
      doRedraw,
    );

  const hasTextElements =
    activeTextBox !== null || textBoxesRef.current.length > 0;

  const handleCameraChange = useCallback(() => {
    if (hasTextElements) setPanTick((t) => t + 1);
  }, [hasTextElements]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "text") {
      placeTextBox(e.clientX, e.clientY);
      triggerUpdate();
    }
  };

  useOfflineShapes(
    canvasRef,
    camera,
    shapesRef,
    activeShape,
    userIdRef,
    activeTool,
    strokeColor,
    doRedraw,
  );
  useOfflineHandTool(canvasRef, camera, activeTool, doRedraw);

  useOfflineDraw(
    canvasRef,
    camera,
    activeStrokes,
    currentStroke,
    strokes,
    userIdRef,
    isDrawing,
    setCursorPos,
    selectedImgIdx,
    activeTool,
    strokeColor,
    doRedraw,
  );

  useOfflineEraser(canvasRef, camera, strokes, activeTool, doRedraw);
  useOfflineCanvasZoom(
    wrapperRef,
    canvasRef,
    camera,
    handleCameraChange,
    doRedraw,
  );

  useOfflineImageTransform(
    canvasRef,
    camera,
    images,
    imageCache,
    selectedImgIdx,
    doRedraw,
  );

  useOfflineLines(
    canvasRef,
    camera,
    linesRef,
    activeLine,
    userIdRef,
    activeTool,
    strokeColor,
    doRedraw,
  );

  useOfflineDeleteElement(
    canvasRef,
    camera,
    shapesRef,
    activeTool,
    linesRef,
    textBoxesRef,
    doRedraw,
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
  }, []);

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
              const el = e.currentTarget;
              updateTextBoxContent(el.value);

              const measure = measureRef.current!;
              const scale = camera.current.scale;

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

              const rect = el.getBoundingClientRect();
              autoPanIfNeeded(
                canvasRef.current!,
                canvasRef.current!.getContext("2d")!,
                camera,
                rect.right,
                rect.bottom,
                images,
                imageCache,
                activeStrokes,
                currentStroke,
                strokes,
                userIdRef.current,
                strokeColor,
                () => setPanTick((t) => t + 1),
                shapesRef,
                activeShape,
                linesRef,
                activeLine,
                selectedId,
                textBoxesRef,
                activeTextBox,
              );
            }}
            onBlur={(e) => {
              finalizeTextBox(e.target.value);
              editingExistingRef.current = false;
              triggerUpdate();
            }}
          />
        </>
      )}
    </div>
  );
}
