import {SquareDashedTopSolid,SquareDashed} from "lucide-react"
import { useToolSettings } from "../../../../context/ToolBarLeftContext"

export default function EdgeSetting() {
  const { edge, setEdge } = useToolSettings();
  return (
    <div className="mt-2">
      <p className="mb-2 text-sm text-gray-300 ">Edges</p>
      <div className="flex gap-2">
        <div 
          onClick={() => setEdge("sharp")}
          className={`icon-background ${edge === "sharp" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <SquareDashedTopSolid />
        </div>
        <div 
          onClick={() => setEdge("rounded")}
          className={`icon-background ${edge === "rounded" ? "bg-[rgb(65,65,137)]" : "bg-[rgb(51,52,55)]"} `}
        >
          <SquareDashed />
        </div>
      </div>
    </div>
  )
}
