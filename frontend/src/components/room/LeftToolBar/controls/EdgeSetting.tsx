import {SquareDashedTopSolid,SquareDashed} from "lucide-react"

export default function EdgeSetting() {
  return (
    <div>
      <p>Edges</p>
      <div className="flex gap-2">
        <div><SquareDashedTopSolid /></div>
        <div><SquareDashed /></div>
      </div>
    </div>
  )
}
