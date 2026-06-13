import React, { useEffect, useRef, useState } from "react";
import type { BoardImage, Stroke, Point, ActiveStroke } from "../types";
import { getCanvasPoint, redraw } from "../canvas";
import { getClickedImage } from "../tools/getClickedImage";
import { socket } from "../../../../services/socket";

export function useImageTransform(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  camera: React.RefObject<any>,
  images: React.RefObject<BoardImage[]>,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  activeStrokes: React.RefObject<Record<string, ActiveStroke>>,
  currentStroke: React.RefObject<Point[]>,
  strokes: React.RefObject<Stroke[]>,
  userIdRef: React.RefObject<string>,
  color: string,
  selectedImgIdx: React.RefObject<number>,
  roomId:string
) {
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    //changed image position
    socket.on("move-image",(data)=>{
     const image=images.current.find((img)=>img.id==data.id);
     if(image){

       image.x=data.x;
       image.y=data.y;

       
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
     }

    })



    const onDblClick = (e: MouseEvent) => {
      const point = getCanvasPoint(e, canvas, camera);
      const isImageClicked = getClickedImage(images.current, point);
      selectedImgIdx.current = isImageClicked;
    };

    const startImageMove = (e: MouseEvent) => {
      if (selectedImgIdx.current === -1) return;
      isDragging.current = true;
      const currentPoint = getCanvasPoint(e, canvas, camera);
      let img = images.current[selectedImgIdx.current];
      dragOffset.current.x = currentPoint.x - img.x;
      dragOffset.current.y = currentPoint.y - img.y;
    };
    const moveImage = (e: MouseEvent) => {
      if (selectedImgIdx.current === -1) return;
      if (!isDragging.current) return;
      const currentPoint = getCanvasPoint(e, canvas, camera);
      let img = images.current[selectedImgIdx.current];

      img.x = currentPoint.x - dragOffset.current.x;
      img.y = currentPoint.y - dragOffset.current.y;

      //send to socket
      socket.emit("move-image", { x: img.x, y: img.y, id: img.id, roomId });

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
    const stopMoveImage = () => {
      selectedImgIdx.current=-1;
      isDragging.current = false;
    };

    canvas.addEventListener("dblclick", onDblClick);
    canvas.addEventListener("mousedown", startImageMove);
    canvas.addEventListener("mousemove", moveImage);
    canvas.addEventListener("mouseup", stopMoveImage);
    return () => {
      canvas.removeEventListener("dblclick", onDblClick);
      canvas.removeEventListener("mousedown", startImageMove);
      canvas.removeEventListener("mousemove", moveImage);
      canvas.removeEventListener("mouseup", stopMoveImage);
    };
  }, []);
}
