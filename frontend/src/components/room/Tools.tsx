//lucide react components
import { Circle, Diamond, Minus, MoveRight, Pencil, Square, TypeOutline } from "lucide-react";
import { Image, Eraser, MousePointer, Hand } from "lucide-react";
import { useState, type SetStateAction } from "react";

interface ToolsProps {
  eraserMode: boolean;
  setEraserMode: React.Dispatch<React.SetStateAction<boolean>>;
  eraserRef: React.RefObject<boolean>;
  openCursor: boolean;
  setOpenCursor: React.Dispatch<React.SetStateAction<boolean>>;
  floatChatInterface: boolean;
  setFloatChatInterface: React.Dispatch<React.SetStateAction<boolean>>;
  activeTool: string | null;
  setActiveTool:React.Dispatch<SetStateAction<string|null>>
}

export default function Tools({
  eraserMode,
  setEraserMode,
  eraserRef,
  openCursor,
  setOpenCursor,
  floatChatInterface,
  setFloatChatInterface,
  activeTool,
  setActiveTool
}: ToolsProps) {
  ;
  return (
    <>
      <div className="flex gap-4 shadow-lg">
        <button
          onClick={() => setActiveTool("mouse")}
          className={activeTool === "mouse" ? "tool-btn-active" : "tool-btn"}
        >
          <MousePointer />
        </button>
        <button 
          onClick={() => setActiveTool("pen")}
          className={activeTool === "pen" ? "tool-btn-active" : "tool-btn "}
        >
          <Pencil />
        </button>
        <button
          onClick={() => setActiveTool("text")}
          className={activeTool === "text" ? "tool-btn-active" : "tool-btn"}
        >
          <TypeOutline />
        </button>
        <button
          onClick={() => setActiveTool("hand")}
          className={activeTool === "hand" ? "tool-btn-active" : "tool-btn"}
        >
          <Hand />
        </button>
        <button
          onClick={() => {
            setEraserMode(!eraserMode);
            eraserRef.current = !eraserRef.current;
            setActiveTool("eraser");
          }}
          className={activeTool === "eraser" ? "tool-btn-active" : "tool-btn"}
        >
          <Eraser />
        </button>

        <button>
            <MoveRight
             onClick={() => setActiveTool("arrow")}
          className={activeTool === "arrow" ? "tool-btn-active" : "tool-btn"}
        />
        </button>
        <button>
          <Minus  onClick={() => setActiveTool("line")}
          className={activeTool === "line" ? "tool-btn-active" : "tool-btn"}/> 
        </button>
        <button>
            <Square  onClick={() => setActiveTool("square")}
          className={activeTool === "square" ? "tool-btn-active" : "tool-btn"}/>
        </button>
        <button>
            <Diamond  onClick={() => setActiveTool("diamond")}
          className={activeTool === "diamond" ? "tool-btn-active" : "tool-btn"}/>
        </button>
        <button>
            <Circle  onClick={() => setActiveTool("circle")}
          className={activeTool === "circle" ? "tool-btn-active" : "tool-btn"}/>
        </button>


        <button className="hover:bg-gray-500">
          <label htmlFor="image-upload" className="hover:bg-gray-200">
            <Image />
          </label>
        </button>
        <button onClick={() => setOpenCursor(!openCursor)}>VideoConf</button>
        <button onClick={() => setFloatChatInterface(!floatChatInterface)}>
          Float
        </button>
      </div>
    </>
  );
}
