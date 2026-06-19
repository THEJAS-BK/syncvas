import React, { useEffect, useRef } from "react";

import { socket } from "../../../../services/socket";
import type { ActiveStroke, BoardImage, Line, Point, Shape, Stroke } from "../types";

import { getCanvasPoint, redraw, isPointNearStroke } from "../canvas";

export function useSocketDraw(
  roomId: string,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  camera: React.RefObject<any>,
  images: React.RefObject<BoardImage[]>,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: React.RefObject<Record<string, ActiveStroke>>,
  currentStroke: React.RefObject<Point[]>,
  strokes: React.RefObject<Stroke[]>,
  userIdRef: React.RefObject<string>,
  color: string,
  isDrawing: React.RefObject<boolean>,
  setCursorPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
  selectedImgIdx: React.RefObject<number>,
  eraserRef: React.MutableRefObject<boolean>,
  shapesRef?: React.RefObject<Shape[]>,
  activeShape?: React.RefObject<Shape | null>,
  activeTool?: string | null,
  linesRef?: React.RefObject<Line[]>,
activeLine?: React.RefObject<Line | null>,
) {
  const isEraserSelected = useRef(false);

  useEffect(() => {
    //handle drawing
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const startDrawing = (e: MouseEvent) => {
      if (eraserRef.current === true) {
        isEraserSelected.current = true;
        return;
      }
      if (selectedImgIdx.current !== -1) return;
      if (activeTool == "pen") {
        isDrawing.current = true;  
      }
      if(activeTool=="square"){
        isDrawing.current=false;
        return;
      }
   
      const { x, y } = getCanvasPoint(e, canvas, camera);
      currentStroke.current = [{ x, y }];

      socket.emit("stroke-start", { userId: userIdRef.current, roomId, color });
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
      activeLine
      );
    };

    const draw = (e: MouseEvent) => {
      setCursorPos({
        x: e.clientX,
        y: e.clientY,
      });
      if (eraserRef.current === true && isEraserSelected.current) {
        const point = getCanvasPoint(e, canvas, camera);
        eraseAtPoint(point);
        return;
      }
      if (!isDrawing.current) return;
      const { x, y } = getCanvasPoint(e, canvas, camera);
      currentStroke.current.push({ x, y });

      socket.emit("stroke-points", {
        userId: userIdRef.current,
        roomId,
        point: { x, y },
      });

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
      activeLine
      );
    };

    //stop drawing
    const stopDrawing = () => {
      isEraserSelected.current = false;
      if (currentStroke.current.length > 0) {
        const completedStrokes: Stroke = {
          points: [...currentStroke.current],
          userId: userIdRef.current,
          color,
        };

        strokes.current.push(completedStrokes);
        socket.emit("stroke-end", {
          userId: userIdRef.current,
          roomId,
          strokes: completedStrokes,
        });
      }
      currentStroke.current = [];
      isDrawing.current = false;

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
      activeLine
      );
    };

    //received data from the backend
    socket.on("stroke-start", ({ userId, color }) => {
      activeStrokes.current[userId] = {
        color,
        points: [],
      };
    });

    socket.on("stroke-points", ({ userId, point, color: incomingColor }) => {
      if (!activeStrokes.current[userId]) {
        activeStrokes.current[userId] = {
          color: incomingColor,
          points: [],
        };
      }
      activeStrokes.current[userId].points.push(point);

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
        incomingColor,
        shapesRef,
        activeShape,
        linesRef,
        activeLine
      );
    });

    socket.on("stroke-end", ({ userId }) => {
      let activeStroke = activeStrokes.current[userId];

      if (!activeStroke) return;

      strokes.current.push({
        userId: userId,
        color: activeStroke.color,
        points: activeStroke.points,
      });

      delete activeStrokes.current[userId];

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
      activeLine
      );
    });
    socket.on("stroke-delete", (point: Point) => {
      strokes.current = strokes.current.filter(
        (stroke) => !isPointNearStroke(point, stroke),
      );
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
        activeShape,       linesRef,
      activeLine
      );
    });

    const eraseAtPoint = (point: Point) => {
      const before = strokes.current.length;
      strokes.current = strokes.current.filter(
        (stroke) => !isPointNearStroke(point, stroke),
      );
      if (strokes.current.length !== before) {
        socket.emit("stroke-delete", { point: point, roomId });
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
          activeShape,       linesRef,
      activeLine
        );
      }
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDrawing);
    return () => {
      socket.off("stroke-start");
      socket.off("stroke-points");
      socket.off("stroke-end");
      socket.off("stroke-delete");
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDrawing);
    };
  }, [activeTool]);
}
