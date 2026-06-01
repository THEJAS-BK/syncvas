import React, { useEffect } from "react";

import type { ActiveStroke, BoardImage, Point, Stroke } from "../types";

import { redraw } from "../canvas";

export function useCanvasZoom(
    canvasRef: React.RefObject<HTMLCanvasElement|null>,
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
    canvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  },[]);

  
}
