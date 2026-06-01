import React, { useEffect } from "react";

import { socket } from "../../../../services/socket";
import type { ActiveStroke, BoardImage, Point, Stroke } from "../types";


import { getCanvasPoint,redraw } from "../canvas";

export function useSocketDraw(
  roomId: string,
   canvasRef: React.RefObject<HTMLCanvasElement|null>,
  camera: React.RefObject<any>,
  images: React.RefObject<BoardImage[]>,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: React.RefObject<Record<string, ActiveStroke>>,
  currentStroke: React.RefObject<Point[]>,
  strokes: React.RefObject<Stroke[]>,
  userIdRef: React.RefObject<string>,
  color: string,
  isDrawing:React.RefObject<boolean>,
  setCursorPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
) {
  useEffect(() => {
    //handle drawing
      const canvas = canvasRef.current; 
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    
    const startDrawing = (e: MouseEvent) => {
      isDrawing.current = true;
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
      );
    };

    const draw = (e: MouseEvent) => {
      setCursorPos({
        x: e.clientX,
        y: e.clientY,
      });
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
      );
    };

    //stop drawing
    const stopDrawing = () => {
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
      );
    };

    //received data from the backend
    socket.on("stroke-start", ({ userId, color }) => {
      activeStrokes.current[userId] = {
        color,
        points: [],
      };
    });

    socket.on("stroke-points", ({ userId, point, color:incomingColor }) => {
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
      );
    });

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDrawing);
    return () => {
      socket.off("stroke-start");
      socket.off("stroke-points");
      socket.off("stroke-end");
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDrawing);
    };
  },[]);
}
