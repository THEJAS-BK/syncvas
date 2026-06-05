import React, { useEffect } from "react";

import { socket } from "../../../../services/socket";
import type { ActiveStroke, BoardImage, Point, Stroke } from "../types";
import { redraw } from "../canvas";

export function useSocketBoard(
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
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    //setup board start
    socket.emit("board-state", roomId);
    socket.on("board-state", (savedStrokes: Stroke[]) => {
      strokes.current = savedStrokes;
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
    socket.on("image-state", (savedImages: BoardImage[]) => {
      images.current.length = 0;
      images.current.push(...savedImages);
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

    //image upload
    socket.on("image-upload", (imageData) => {
      images.current.push(imageData);
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
    return () => {
      socket.off("board-state");
      socket.off("image-state");
      socket.off("image-upload");
    };
  }, []);
}
