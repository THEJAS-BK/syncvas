import type { ImageElement } from "./types/canvasTypes";

export function registerImageHandler(socket: any, roomImages: Record<string, ImageElement[]>){
     //image upload Handler
    socket.on("image-upload", (data:any) => {
      roomImages[data.roomId] ??= [];
      const imageData: ImageElement = {
        id: data.id,
        image: data.image,
        userId: socket.data.userId,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        rotation: data.rotation || 0,
      };

      roomImages[data.roomId]!.push(imageData);
      socket.to(data.roomId).emit("image-upload", imageData);
    });

 
    //image handlers

    socket.on("move-image", (data:any) => {
      const image = roomImages[data.roomId]?.find((img) => img.id == data.id);
      if (image) {
        image.x = data.x;
        image.y = data.y;
        image.rotation = data.rotation || 0;
      }
      socket.to(data.roomId).emit("move-image", image);
    });

    socket.on("rotate-image", (data:any) => {
      const image = roomImages[data.roomId]?.find((img) => img.id === data.id);
      if (image) {
        image.rotation = data.rotation || 0;
      }
      socket.to(data.roomId).emit("rotate-image", image);
    });

    socket.on("resize-image", (data:any) => {
      const image = roomImages[data.roomId]?.find((img) => img.id === data.id);
      if (image) {
        image.width = data.width;
        image.height = data.height;
      }
      socket.to(data.roomId).emit("resize-image", image);
    });
    socket.on("delete-image", (data:any) => {
      roomImages[data.roomId] = (roomImages[data.roomId] ?? []).filter(
        (img) => img.id !== data.id,
      );
      socket.to(data.roomId).emit("delete-image", data.id);
    });
}