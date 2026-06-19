import type React from "react";
import { socket } from "../../../../services/socket";
import type { BoardImage } from "../types";
export function handleImageUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  images: React.RefObject<BoardImage[]>,
  setRedrawVersion: React.Dispatch<React.SetStateAction<number>>,
  roomId: string,
) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const base64 = reader.result as string;
    const id = crypto.randomUUID();

    const imageData = {
      id,
      image: base64,
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      rotation: 0,
    };

    images.current?.push(imageData);
    setRedrawVersion((v) => v + 1);

    socket.emit("image-upload", { roomId, ...imageData });
  };

  reader.readAsDataURL(file);
}
