import { createContext, useContext, useState } from "react";

type ToolSettings = {
  //color
  strokeColor: string;
  setStrokeColor: (c: string) => void;

  //background color
  fillColor: string;
  setFillColor: (c: string) => void;

  //fill shape type
  shapeFillType: string;
  setShapeFillType: (c: string) => void;

  //strokes
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;

  //comman
  opacity: number;
  setOpacity: (o: number) => void;

  //shade
  shadeIdx: number;
  setShadeIdx: (s: number) => void;

  //font family
  fontFamily: string;
  setFontFamily: (f: string) => void;

  //font size
  fontSize: string;
  setFontSize: (s: string) => void;

  //textAlign
  textAlign: string;
  setTextAlign: (a: string) => void;

  //strokeStyle
  strokeStyle: string;
  setStrokeStyle: (s: string) => void;

  //sloppines
  sloppines: string;
  setSloppines: (s: string) => void;

  //arrow types
  arrowType: string;
  setArrowType: (s: string) => void;

  //arrow head
  arrowHead: string;
  setArrowHead: (s: string) => void;

  //edge
  edge: string;
  setEdge: (s: string) => void;
};

const ToolBarLeftContext = createContext<ToolSettings | null>(null);

export function ToolSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [strokeColor, setStrokeColor] = useState("");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [shadeIdx, setShadeIdx] = useState(4);
  const [shapeFillType, setShapeFillType] = useState("hachure");
  const [fontFamily, setFontFamily] = useState("hand-draw");
  const [fontSize, setFontSize] = useState("small");
  const [textAlign, setTextAlign] = useState("left");
  const [strokeStyle, setStrokeStyle] = useState("solid");
  const [sloppines, setSloppines] = useState("artist");
  const [arrowType, setArrowType] = useState("straight");
  const [arrowHead, setArrowHead] = useState("none");
  const [edge, setEdge] = useState("sharp");

  return (
    <ToolBarLeftContext.Provider
      value={{
        strokeColor,
        setStrokeColor,
        fillColor,
        setFillColor,
        strokeWidth,
        setStrokeWidth,
        opacity,
        setOpacity,
        shadeIdx,
        setShadeIdx,
        shapeFillType,
        setShapeFillType,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        textAlign,
        setTextAlign,
        strokeStyle,
        setStrokeStyle,
        sloppines,
        setSloppines,
        arrowType,
        setArrowType,
        arrowHead,
        setArrowHead,
        edge,
        setEdge,
      }}
    >
      {children}
    </ToolBarLeftContext.Provider>
  );
}

export function useToolSettings() {
  const ctx = useContext(ToolBarLeftContext);
  if (!ctx)
    throw new Error("useToolSettings must be used inside ToolSettingsProvider");
  return ctx;
}
