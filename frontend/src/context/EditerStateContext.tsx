
import { createContext, useContext, useMemo, useState, type Dispatch,type ReactNode,type SetStateAction } from "react"
import type { Line, Shape, TextBox } from "../components/room/Multicursor/types";
type EditorStateContextType = {
  activeTool: string | null;
  setActiveTool: Dispatch<SetStateAction<string | null>>;
  isEditMode: Line|Shape|TextBox|null;
  setIsEditMode: Dispatch<SetStateAction<Line|Shape|TextBox|null>>;
};


const EditorStateContext=createContext<EditorStateContextType|null>(null)

export function EditorStateProvider({children}:{children:ReactNode}){
const [activeTool, setActiveTool] = useState<string | null>(null);
const [isEditMode, setIsEditMode] = useState<Line|Shape|TextBox|null>(null);
 const value = useMemo(
    () => ({ activeTool, setActiveTool, isEditMode, setIsEditMode }),
    [activeTool, isEditMode]
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