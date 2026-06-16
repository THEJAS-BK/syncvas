import { LineSquiggle,MoveUpRight,CornerUpRight,TrendingUp,ArrowRightFromLine,MoveRight } from "lucide-react"

export default function ArrowSetting() {
  return (
    <div>
      <div>
        <span>Sloppiness</span>
        <div className="flex space-x-2">
            <div><LineSquiggle strokeWidth={0.5} /></div>
            <div><LineSquiggle strokeWidth={1.75} /></div>
            <div><LineSquiggle strokeWidth={3} /></div>
        </div>
      </div>

        <div>
            <span>Arrow type</span>
            <div className="flex space-x-2">
                <div><MoveUpRight strokeWidth={1.75} /></div>
                <div><CornerUpRight strokeWidth={1.75} /></div>
                <div><TrendingUp strokeWidth={1.75} /></div>
            </div>
        </div>

        <div>
            <span>Arrowheads</span>
            <div className="flex space-x-2">
                <div><ArrowRightFromLine strokeWidth={1.75} /></div>
                <div><MoveRight strokeWidth={1.75} /></div>
            </div>
        </div>


    </div>
  )
}
