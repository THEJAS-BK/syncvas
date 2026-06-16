import React from 'react'
import FullToolBar from './Layouts/FullToolBar'


export default function ToolBarContainer({activeTool}:{activeTool:string|null}) {
  return (
    <div >
    <FullToolBar activeTool={activeTool}/>
    </div>
  )
}
