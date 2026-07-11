import {
  createContext,
  useContext,
  useState,
  type SetStateAction,
  type Dispatch,
  type RefObject,
} from "react";
import type {
  Line,
  Shape,
  TextBox,
} from "../components/room/Multicursor/types";
import { useRef } from "react";
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

  edgeStyle: string;
  setEdgeStyle: Dispatch<SetStateAction<string>>;

  activeTool: string | null;
  setActiveTool: Dispatch<SetStateAction<string | null>>;

  selectedEle: Shape | Line | TextBox | null;
  setSelectedEle: Dispatch<SetStateAction<Shape | Line | TextBox | null>>;

  selectedId: RefObject<string | null>;

  linesRef: RefObject<Line[]>;
  activeLine: RefObject<Line | null>;

  textBoxesRef: RefObject<TextBox[]>;
  activeTextBox: RefObject<TextBox | null>;

  shapesRef: RefObject<Shape[]>;
  activeShape: RefObject<Shape | null>;

  //do redraw ref
  doRedrawRef: RefObject<(() => void) | null>;

  roomId:string|null
  setRoomId:Dispatch<SetStateAction<string>>
};

const ToolBarLeftContext = createContext<ToolSettings | null>(null);

export function ToolSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const [strokeColor, setStrokeColor] = useState("");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [opacity, setOpacity] = useState(100);
  const [shadeIdx, setShadeIdx] = useState(4);
  const [shapeFillType, setShapeFillType] = useState("hachure");
  const [fontFamily, setFontFamily] = useState("hand-draw");
  const [fontSize, setFontSize] = useState("small");
  const [textAlign, setTextAlign] = useState("left");
  const [strokeStyle, setStrokeStyle] = useState("solid");
  const [sloppines, setSloppines] = useState("artist");
  const [arrowType, setArrowType] = useState("straight");
  const [arrowHead, setArrowHead] = useState("none");
  const [edgeStyle, setEdgeStyle] = useState("sharp");

  const [selectedEle, setSelectedEle] = useState<Shape | Line | TextBox | null>(
    null,
  );

  const selectedId = useRef<string | null>(null);

  const shapesRef = useRef<Shape[]>([]);
  const activeShape = useRef<Shape | null>(null);
  const textBoxesRef = useRef<TextBox[]>([]);
  const activeTextBox = useRef<TextBox | null>(null);
  const linesRef = useRef<Line[]>([]);
  const activeLine = useRef<Line | null>(null);

  const doRedrawRef = useRef<(() => void) | null>(null);
  const [roomId,setRoomId]=useState<string>("")

  return (
    <ToolBarLeftContext.Provider
      value={{
        activeTool,
        setActiveTool,
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
        edgeStyle,
        setEdgeStyle,
        selectedEle,
        setSelectedEle,
        selectedId,
        shapesRef,
        activeShape,
        textBoxesRef,
        activeTextBox,
        linesRef,
        activeLine,
        doRedrawRef,
        roomId,
        setRoomId
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
