import { createContext, useContext, useState } from "react";

type ToolSettings = {
  //color
  strokeColor: string;
  setStrokeColor: (c: string) => void;
  fillColor: string;
  setFillColor: (c: string) => void;

  //strokes
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;

  //comman
  opacity: number;
  setOpacity: (o: number) => void;

  //shade
  shadeIdx: number;
  setShadeIdx: (s: number) => void;
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
