import React, { useEffect, useRef } from "react";
import type { BoardImage } from "../../room/Multicursor/types.ts";
import {
  getCanvasPoint,
  getSelectionLineForImage,
  isRotationHandlerClicked,
  getClickedResizeHandle,
} from "../../room/Multicursor/canvas.ts";
import { getClickedImage } from "../../room/Multicursor/tools/getClickedImage";

export function useOfflineImageTransform(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  camera: React.RefObject<any>,
  images: React.RefObject<BoardImage[]>,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  selectedImgIdx: React.RefObject<number>,
  doRedraw: () => void,
) {
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const isRotating = useRef(false);
  const isResizing = useRef(false);
  const resizeHandler = useRef<
    "top-left" | "top-right" | "bottom-left" | "bottom-right" | null
  >(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onDblClick = (e: MouseEvent) => {
      const point = getCanvasPoint(e, canvas, camera);
      const isImageClicked = getClickedImage(images.current, point);
      selectedImgIdx.current = isImageClicked;

      getSelectionLineForImage(ctx, images, selectedImgIdx.current);
    };

    const startImageMove = (e: MouseEvent) => {
      if (selectedImgIdx.current === -1) return;

      const currentPoint = getCanvasPoint(e, canvas, camera);
      const img = images.current[selectedImgIdx.current];

      if (isRotationHandlerClicked(img, currentPoint)) {
        isRotating.current = true;
        return;
      }

      const handle = getClickedResizeHandle(img, currentPoint);
      if (handle) {
        isResizing.current = true;
        resizeHandler.current = handle;
        return;
      }

      isDragging.current = true;
      dragOffset.current.x = currentPoint.x - img.x;
      dragOffset.current.y = currentPoint.y - img.y;
    };

    const moveImage = (e: MouseEvent) => {
      if (selectedImgIdx.current === -1) return;
      if (!isDragging.current && !isRotating.current && !isResizing.current)
        return;

      const currentPoint = getCanvasPoint(e, canvas, camera);
      const img = images.current[selectedImgIdx.current];

      if (isRotating.current) {
        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;

        img.rotation =
          Math.atan2(currentPoint.y - centerY, currentPoint.x - centerX) +
          Math.PI / 2;
      } else if (isResizing.current) {
        const minSize = 20;

        const centerX = img.x + img.width / 2;
        const centerY = img.y + img.height / 2;
        const rotation = img.rotation || 0;

        const dx = currentPoint.x - centerX;
        const dy = currentPoint.y - centerY;

        const localX = dx * Math.cos(-rotation) - dy * Math.sin(-rotation);
        const localY = dx * Math.sin(-rotation) + dy * Math.cos(-rotation);

        const localPointX = localX + img.width / 2;
        const localPointY = localY + img.height / 2;

        switch (resizeHandler.current) {
          case "bottom-right":
            img.width = Math.max(minSize, localPointX);
            img.height = Math.max(minSize, localPointY);
            break;

          case "bottom-left": {
            const newWidth = Math.max(minSize, img.width - localPointX);
            img.x += img.width - newWidth;
            img.width = newWidth;
            img.height = Math.max(minSize, localPointY);
            break;
          }

          case "top-right": {
            const newHeight = Math.max(minSize, img.height - localPointY);
            img.y += img.height - newHeight;
            img.height = newHeight;
            img.width = Math.max(minSize, localPointX);
            break;
          }

          case "top-left": {
            const newWidth = Math.max(minSize, img.width - localPointX);
            const newHeight = Math.max(minSize, img.height - localPointY);

            img.x += img.width - newWidth;
            img.y += img.height - newHeight;
            img.width = newWidth;
            img.height = newHeight;
            break;
          }
        }
      } else {
        img.x = currentPoint.x - dragOffset.current.x;
        img.y = currentPoint.y - dragOffset.current.y;
      }

      doRedraw();
      getSelectionLineForImage(ctx, images, selectedImgIdx.current);
    };

    const stopMoveImage = () => {
      selectedImgIdx.current = -1;
      isDragging.current = false;
      isRotating.current = false;
      isResizing.current = false;
      resizeHandler.current = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedImgIdx.current === -1) return;

        const img = images.current[selectedImgIdx.current];
        if (!img) return;

        images.current = images.current.filter((i) => i.id !== img.id);
        imageCache.current.delete(img.id);
        selectedImgIdx.current = -1;

        doRedraw();
      }
    };

    canvas.addEventListener("dblclick", onDblClick);
    canvas.addEventListener("mousedown", startImageMove);
    canvas.addEventListener("mousemove", moveImage);
    canvas.addEventListener("mouseup", stopMoveImage);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      canvas.removeEventListener("dblclick", onDblClick);
      canvas.removeEventListener("mousedown", startImageMove);
      canvas.removeEventListener("mousemove", moveImage);
      canvas.removeEventListener("mouseup", stopMoveImage);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [doRedraw]);
}