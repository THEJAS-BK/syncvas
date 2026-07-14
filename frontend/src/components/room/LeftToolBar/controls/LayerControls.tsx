import {
  ArrowDownToLine,
  ArrowUpToLine,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useLayers } from "../../Multicursor/hooks/useLayers";

export default function LayerControls() {
  const layers = useLayers();

  if (!layers) return null;
  const { sendToBack, sendBackward, bringForward, bringToFront } = layers;
  return (
    <div>
      <span className="mb-2 mt-2 ml-1 text-sm text-gray-300">Layers</span>
      <div className="flex gap-3 mt-2">
        <div
          className="icon-background p-0.5 rounded  bg-[rgb(51,52,55)]"
          onClick={sendToBack}
        >
          <ArrowDownToLine className="icon" strokeWidth={2} />
        </div>

        <div
          className="icon-background p-0.5 rounded  bg-[rgb(51,52,55)]"
          onClick={sendBackward}
        >
          <ArrowDown className="icon" strokeWidth={2} />
        </div>

        <div
          className="icon-background p-0.5 rounded  bg-[rgb(51,52,55)]"
          onClick={bringForward}
        >
          <ArrowUp className="icon" strokeWidth={2} />
        </div>

        <div
          className="icon-background p-0.5 rounded  bg-[rgb(51,52,55)]"
          onClick={bringToFront}
        >
          <ArrowUpToLine className="icon" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
