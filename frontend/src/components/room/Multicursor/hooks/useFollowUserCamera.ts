import { useEffect } from "react";
import { useToolSettings } from "../../../../context/ToolBarLeftContext";
import { socket } from "../../../../services/socket";

export function useFollowUserCamera(
  camera: React.RefObject<any>,
    doRedraw:()=>void,
    roomId:string
) {
    const {followUserCamera}=useToolSettings();

    useEffect(()=>{
        socket.emit("camera-update",camera.current,roomId)
        return ()=>{
            socket.off("camera-update");
        }
    },[camera,roomId])

    useEffect(()=>{
        if(!followUserCamera) return;

        console.log(camera)
        socket.on("camera-update",(data:{socketId:string,camera:{x:number,y:number,scale:number}})=>{
           if(followUserCamera===data.socketId){
               camera.current.x=data.camera.x;
               camera.current.y=data.camera.y;
               camera.current.scale=data.camera.scale;
           }
           doRedraw();
        })

        return ()=>{
            socket.off("camera-update");
        }
    },[followUserCamera,roomId])

}
