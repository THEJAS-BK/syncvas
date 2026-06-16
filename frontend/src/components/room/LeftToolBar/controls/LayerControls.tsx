import { ArrowDownToLine, ArrowUpToLine, MoveDown, MoveUp } from 'lucide-react'
import React from 'react'

export default function LayerControls() {
  return (
    <div>
      <span>Layers</span>
      <div className="flex gap-2">
        <div><ArrowDownToLine strokeWidth={3} /></div>
        <div><MoveDown strokeWidth={3} /></div>
        <div><MoveUp strokeWidth={3} /></div>
        <div><ArrowUpToLine strokeWidth={3} /></div>
      </div>
    </div>
  )
}
