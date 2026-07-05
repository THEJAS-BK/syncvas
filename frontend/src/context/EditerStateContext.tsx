import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import type { Line, Shape, TextBox } from "../components/room/Multicursor/types";

type ElementPatch = Partial<Shape> | Partial<Line> | Partial<TextBox>;

type EditorStateContextType = {
  activeTool: string | null;
  setActiveTool: Dispatch<SetStateAction<string | null>>;
  selectedElement: Line | Shape | TextBox | null;
  setSelectedElement: Dispatch<SetStateAction<Line | Shape | TextBox | null>>;
  editModeTool: string | null;
  setEditModeTool: Dispatch<SetStateAction<string | null>>;
  updateSelectedElement: (patch: ElementPatch) => void;
  setUpdateSelectedElement: Dispatch<SetStateAction<(patch: ElementPatch) => void>>;

  editcolor:string|null;
  setEditColor: Dispatch<SetStateAction<string | null>>;
};

const EditorStateContext = createContext<EditorStateContextType | null>(null)

export function EditorStateProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<Line | Shape | TextBox | null>(null);
  const [editModeTool, setEditModeTool] = useState<string | null>(null);
  const [updateSelectedElement, setUpdateSelectedElement] = useState<(patch: ElementPatch) => void>(
    () => () => {}
  );
  const [editcolor, setEditColor] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      activeTool, setActiveTool,
      selectedElement, setSelectedElement,
      editModeTool, setEditModeTool,
      updateSelectedElement, setUpdateSelectedElement,
      editcolor, setEditColor,
    }),
    [activeTool, selectedElement, editModeTool, updateSelectedElement]
  );

  return (
    <EditorStateContext.Provider value={value}>
      {children}
    </EditorStateContext.Provider>
  );
}

export function useEditorState() {
  const ctx = useContext(EditorStateContext);
  if (!ctx) throw new Error("useEditorState must be used within EditorStateProvider");
  return ctx;
}