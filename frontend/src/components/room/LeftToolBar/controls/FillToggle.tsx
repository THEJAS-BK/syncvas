import { Square, SquareDashedKanban, SquareMenu } from 'lucide-react'
import React from 'react'

export default function FillToggle() {
  return (
    <div>
      <p>Fill</p>
      <div className='flex gap-2'>
        <div>
          <Square />
        </div>
        <div ><SquareMenu /></div>
        <div ><SquareDashedKanban /></div>
      </div>
    </div>
  )
}
