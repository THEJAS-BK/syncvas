import {
  ArrowUpToLine,
  CaseUpper,
  Code,
  TypeOutline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Pencil,
} from "lucide-react";
import { useState } from "react";
export default function FontSetting() {
  const [fontFamily, setFontFamily] = useState<string>("hand-draw");
  const [fontSize, setFontSize] = useState<string>("small");
  const [textAlign, setTextAlign] = useState<string>("left");

  return (
    <div>
      <div>
        <span className="mb-2 text-sm font-medium text-gray-300 ">
          Font family
        </span>
        <div className="flex space-x-2 mt-2">
          <div
            onClick={() => setFontFamily("hand-drawn")}
            className={`icon-background ${fontFamily === "hand-drawn" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <Pencil className="icon" />
          </div>
          <div
            onClick={() => setFontFamily("normal")}
            className={`icon-background ${fontFamily === "normal" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <CaseUpper className="icon" />
          </div>
          <div
            onClick={() => setFontFamily("code")}
            className={`icon-background ${fontFamily === "code" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <Code className="icon" />
          </div>
          <div
            onClick={() => setFontFamily("show-font-picker")}
            className={`icon-background ${fontFamily === "show-font-picker" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <TypeOutline className="icon" />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <span className="mb-2 text-sm font-medium text-gray-300 ">
          Font size
        </span>
        <div className="flex space-x-2">
          <div
            onClick={() => setFontSize("small")}
            className={`icon-background ${fontSize === "small" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            S
          </div>
          <div
            onClick={() => setFontSize("medium")}
            className={`icon-background ${fontSize === "medium" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            M
          </div>
          <div
            onClick={() => setFontSize("large")}
            className={`icon-background ${fontSize === "large" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            L
          </div>
          <div
            onClick={() => setFontSize("extra-large")}
            className={`icon-background ${fontSize === "extra-large" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
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
            className={`icon-background ${textAlign === "left" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <AlignLeft className="icon" />
          </div>
          <div
            onClick={() => setTextAlign("center")}
            className={`icon-background ${textAlign === "center" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <AlignCenter className="icon" />
          </div>
          <div
            onClick={() => setTextAlign("right")}
            className={`icon-background ${textAlign === "right" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
          >
            <AlignRight className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
