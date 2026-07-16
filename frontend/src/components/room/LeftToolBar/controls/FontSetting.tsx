import {
  CaseUpper,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Pencil,
} from "lucide-react";

import { useToolSettings } from "../../../../context/ToolBarLeftContext";

export default function FontSetting() {
  const { fontFamily, setFontFamily, fontSize, setFontSize, textAlign, setTextAlign } = useToolSettings();
  return (
    <div>
      <div>
        <span className="mb-2 text-sm font-medium text-gray-300 ">
          Font family
        </span>
        <div className="flex space-x-2 mt-2">
          <div
            onClick={() => setFontFamily("hand-drawn")}
            className={`icon-background p-0.5 rounded px-1 ${fontFamily === "hand-drawn" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <Pencil className="icon mt-0.5" size={20} />
          </div>
          <div
            onClick={() => setFontFamily("normal")}
            className={`icon-background p-0.5 rounded   ${fontFamily === "normal" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <CaseUpper className="icon" size={24} />
          </div>
          <div
            onClick={() => setFontFamily("code")}
            className={`icon-background p-0.5 rounded  ${fontFamily === "code" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <Code className="icon" size={22} />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <span className="mb-2 text-sm font-medium text-gray-300 ">
          Font size
        </span>
        <div className="flex space-x-2">
          <div
            onClick={() => setFontSize(16)}
            className={`icon-background p-0.5 px-3 rounded ${fontSize === 16? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            S
          </div>
          <div
            onClick={() => setFontSize(20)}
            className={`icon-background p-0.5 px-2 rounded  ${fontSize === 20? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            M
          </div>
          <div
            onClick={() => setFontSize(24)}
            className={`icon-background p-0.5 px-3  rounded  ${fontSize === 24 ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            L
          </div>
          <div
            onClick={() => setFontSize(28)}
            className={`icon-background p-0.5 px-1.5 rounded  ${fontSize === 28 ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            XL
          </div>
        </div>
      </div>

      <div className="mt-2">
        <span className="mb-2 text-sm font-medium text-gray-300 ">
          Text align
        </span>
        <div className="flex space-x-2">
          <div
            onClick={() => setTextAlign("left")}
            className={`icon-background p-0.5 rounded ${textAlign === "left" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <AlignLeft className="icon" />
          </div>
          <div
            onClick={() => setTextAlign("center")}
            className={`icon-background p-0.5 rounded ${textAlign === "center" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <AlignCenter className="icon" />
          </div>
          <div
            onClick={() => setTextAlign("right")}
            className={`icon-background p-0.5 rounded ${textAlign === "right" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <AlignRight className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
