
import { ArrowUpToLine, CaseUpper, Code, TypeOutline,AlignLeft,AlignCenter,AlignRight, Pencil } from "lucide-react"
export default function FontSetting() {
  return (
    <div>
      <div>
        <span>Font family</span>
        <div className="flex space-x-2">
            <div><Pencil strokeWidth={3} /></div>
            <div><CaseUpper strokeWidth={3} /></div>
            <div><Code strokeWidth={3} /></div>
            <div><TypeOutline strokeWidth={3} /></div>
        </div>
      </div>

      <div>
        <span>Font size</span>
        <div className="flex space-x-2">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
        </div>
      </div>

      <div>
        <span>Text align</span>
        <div className="flex space-x-2">
            <div><AlignLeft strokeWidth={3} /></div>
            <div><AlignCenter strokeWidth={3} /></div>
            <div><AlignRight strokeWidth={3} /></div>
        </div>
      </div>
    </div>
  )
}
