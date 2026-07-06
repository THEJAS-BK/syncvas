import { createContext, useContext, useState, type SetStateAction, type Dispatch } from "react";

type ToolSettings = {
  strokeColor: string;
  setStrokeColor: (value: string) => void;

  fillColor: string;
  setFillColor: (value: string) => void;

  shapeFillType: string;
  setShapeFillType: Dispatch<SetStateAction<string>>;

  strokeWidth: number;
  setStrokeWidth: (value: number) => void;

  opacity: number;
  setOpacity: (value: number) => void;

  shadeIdx: number;
  setShadeIdx: Dispatch<SetStateAction<number>>;

  fontFamily: string;
  setFontFamily: Dispatch<SetStateAction<string>>;

  fontSize: string;
  setFontSize: Dispatch<SetStateAction<string>>;

  textAlign: string;
  setTextAlign: Dispatch<SetStateAction<string>>;

  strokeStyle: string;
  setStrokeStyle: Dispatch<SetStateAction<string>>;

  sloppines: string;
  setSloppines: Dispatch<SetStateAction<string>>;

  arrowType: string;
  setArrowType: Dispatch<SetStateAction<string>>;

  arrowHead: string;
  setArrowHead: Dispatch<SetStateAction<string>>;

  edge: string;
  setEdge: Dispatch<SetStateAction<string>>;
};

const ToolBarLeftContext = createContext<ToolSettings | null>(null);

export function ToolSettingsProvider({ children }: { children: React.ReactNode }) {

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
        strokeColor, setStrokeColor,
        fillColor, setFillColor,
        strokeWidth, setStrokeWidth,
        opacity, setOpacity,
        shadeIdx, setShadeIdx,
        shapeFillType, setShapeFillType,
        fontFamily, setFontFamily,
        fontSize, setFontSize,
        textAlign, setTextAlign,
        strokeStyle, setStrokeStyle,
        sloppines, setSloppines,
        arrowType, setArrowType,
        arrowHead, setArrowHead,
        edge, setEdge,
      }}
    >
      {children}
    </ToolBarLeftContext.Provider>
  );
}

export function useToolSettings() {
  const ctx = useContext(ToolBarLeftContext);
  if (!ctx) throw new Error("useToolSettings must be used inside ToolSettingsProvider");
  return ctx;
}