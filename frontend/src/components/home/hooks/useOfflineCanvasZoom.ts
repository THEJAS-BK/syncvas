import React, { useEffect } from "react";

export function useOfflineCanvasZoom(
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  camera: React.RefObject<any>,
  onCameraChange: () => void,
  doRedraw:()=>void
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey) {
        const zoomAmount = e.deltaY * -0.001;
        const oldScale = camera.current.scale;
        const newScale = Math.min(Math.max(0.2, oldScale + zoomAmount), 5);

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const worldX = (mouseX - camera.current.x) / oldScale;
        const worldY = (mouseY - camera.current.y) / oldScale;
        camera.current.scale = newScale;
        camera.current.x = mouseX - worldX * newScale;
        camera.current.y = mouseY - worldY * newScale;
      } else if (e.shiftKey) {
        camera.current.x -= e.deltaY;
      } else {
        camera.current.y -= e.deltaY;
      }

     doRedraw();

      onCameraChange?.();
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [onCameraChange,doRedraw]);
}
