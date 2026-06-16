import React from "react";
import { Ellipsis, GripHorizontal, Minus } from "lucide-react";
export default function StrokeStyle() {
  return (
    <div>
      <span>Stroke style</span>
      <div className="flex space-x-2">
        <div>
          <Minus strokeWidth={3} />
        </div>
        <div>
          <Ellipsis strokeWidth={3} />
        </div>
        <div>
          <GripHorizontal strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
