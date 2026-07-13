import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../../../services/socket";
import { useNavigate, useParams } from "react-router-dom";
const COLORS = ["#1f2937", "#f87171", "#22c55e", "#3b82f6", "#d97706"];
//helper function
import { redraw } from "./canvas";

import VideoTab from "../VideoTab";
//types
import type { BoardImage, Stroke, Point, ActiveStroke } from "./types";
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

//leftSide tools
import { useToolSettings } from "../../../context/ToolBarLeftContext";
import { useEraser } from "./hooks/useEraser";
import { useWebRtcContext } from "../../../context/WebRtcContext";

export default function MultiCursor({
  images,
  imageUpdate,
  roomId,
}: {
  images: React.RefObject<BoardImage[]>;
  imageUpdate: number;
  roomId: string;
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

  const navigate = useNavigate();

  const measureRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [panTick, setPanTick] = useState(0);

  const editingExistingRef = useRef(false);

  const [, forceUpdate] = useState(0);
  const triggerUpdate = () => forceUpdate((n) => n + 1);

  //edit stroke color
  const { strokeColor, setStrokeColor } = useToolSettings();
  useEffect(() => {
    setStrokeColor(color);
  }, []);
  const { activeTool, selectedId } = useToolSettings();

  //shapes,textBoxes and lines
  const {
    shapesRef,
    activeShape,
    textBoxesRef,
    activeTextBox,
    linesRef,
    activeLine,
    doRedrawRef,
    setRoomId,
    strokeWidth,
    opacity,
    fillColor,
  } = useToolSettings();

  useEffect(() => {
    if (roomId) {
      setRoomId(roomId);
    }
  }, [roomId]);

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

  useSelection(
    roomId ?? "",
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
  const { placeTextBox, finalizeTextBox, updateTextBoxContent } = useTextBox(
    roomId ?? "",
    camera,
    userIdRef.current,
    strokeColor,
    textBoxesRef,
    activeTextBox,
    doRedraw,
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
    shapesRef,
    activeShape,
    userIdRef,
    activeTool,
    strokeColor,
    doRedraw,
  );
  useHandTool(canvasRef, camera, activeTool, doRedraw);
  useSocketBoard(roomId ?? "", canvasRef, images, strokes, doRedraw);
  useSocketDraw(
    roomId ?? "",
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

  useEraser(roomId ?? "", canvasRef, camera, strokes, activeTool, doRedraw);
  useCanvasZoom(wrapperRef, canvasRef, camera, handleCameraChange, doRedraw);

  //image transformations
  useImageTransform(
    canvasRef,
    camera,
    images,
    imageCache,
    selectedImgIdx,
    roomId ?? "",
    doRedraw,
  );

  useLines(
    roomId ?? "",
    canvasRef,
    camera,
    linesRef,
    activeLine,
    userIdRef,
    activeTool,
    strokeColor,
    doRedraw,
  );

  useDeleteElement(
    roomId ?? "",
    canvasRef,
    camera,
    shapesRef,
    activeTool,
    linesRef,
    textBoxesRef,
    doRedraw,
  );

  const {
    localStream,
    remoteStreams,
    isReady,
    isVideoMuted,
    isAudioMuted,
    audioToggle,
    videoToggle,
  } = useWebRtcContext();

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
    doRedraw();
  }, [imageUpdate]);

  const { toggleVideoTab } = useToolSettings();

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
      {toggleVideoTab && (
        <div className="absolute right-0 w-[20%] bg-red-600">
          <VideoTab
            roomId={roomId}
            localStream={localStream}
            remoteStreams={remoteStreams}
            isReady={isReady}
            isVideoMuted={isVideoMuted}
            isCursorOpen={true}
          />
        </div>
      )}

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
