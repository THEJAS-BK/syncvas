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
}

export default function Tools({
  eraserMode,
  setEraserMode,
  eraserRef,
  openCursor,
  setOpenCursor,
  floatChatInterface,
  setFloatChatInterface,
}: ToolsProps) {
  const [activeTools, setActiveTools] = useState<string | null>("pen");
  return (
    <>
      <div className="flex gap-4 shadow-lg">
        <button
          onClick={() => setActiveTools("mouse")}
          className={activeTools === "mouse" ? "tool-btn-active" : "tool-btn"}
        >
          <MousePointer />
        </button>
        <button 
          onClick={() => setActiveTools("pen")}
          className={activeTools === "pen" ? "tool-btn-active" : "tool-btn "}
        >
          <Pencil />
        </button>
        <button
          onClick={() => setActiveTools("text")}
          className={activeTools === "text" ? "tool-btn-active" : "tool-btn"}
        >
          <TypeOutline />
        </button>
        <button
          onClick={() => setActiveTools("hand")}
          className={activeTools === "hand" ? "tool-btn-active" : "tool-btn"}
        >
          <Hand />
        </button>
        <button
          onClick={() => {
            setEraserMode(!eraserMode);
            eraserRef.current = !eraserRef.current;
            setActiveTools("eraser");
          }}
          className={activeTools === "eraser" ? "tool-btn-active" : "tool-btn"}
        >
          <Eraser />
        </button>

        <button>
            <MoveRight
             onClick={() => setActiveTools("arrow")}
          className={activeTools === "arrow" ? "tool-btn-active" : "tool-btn"}
        />
        </button>
        <button>
          <Minus  onClick={() => setActiveTools("line")}
          className={activeTools === "line" ? "tool-btn-active" : "tool-btn"}/> 
        </button>
        <button>
            <Square  onClick={() => setActiveTools("square")}
          className={activeTools === "square" ? "tool-btn-active" : "tool-btn"}/>
        </button>
        <button>
            <Diamond  onClick={() => setActiveTools("diamond")}
          className={activeTools === "diamond" ? "tool-btn-active" : "tool-btn"}/>
        </button>
        <button>
            <Circle  onClick={() => setActiveTools("circle")}
          className={activeTools === "circle" ? "tool-btn-active" : "tool-btn"}/>
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
