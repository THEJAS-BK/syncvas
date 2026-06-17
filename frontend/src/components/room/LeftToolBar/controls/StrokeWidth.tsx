import { Minus } from 'lucide-react'
import React from 'react'

export default function StrokeWidth({activeTool}:{activeTool:string}) {
  return (
    <div>
      <p>Stroke Width</p>
      <div className='flex gap-4'>
        <div><Minus strokeWidth={1.25} /></div>
        <div><Minus /></div>
        <div><Minus strokeWidth={3} /></div>
      </div>
    </div>
  )
}
