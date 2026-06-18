
import FullToolBar from './Layouts/FullToolBar'
import CompactToolBar from './Layouts/CompactToolBar'

import "./ToolBarContainer.css"

export default function ToolBarContainer({activeTool}:{activeTool:string|null}) {
  return (
    <div >
    {/* <FullToolBar activeTool={activeTool}/> */}
    <CompactToolBar activeTool={activeTool}/>
    </div>
  )
}
