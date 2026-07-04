
import FullToolBar from './Layouts/FullToolBar'
import CompactToolBar from './Layouts/CompactToolBar'

import "./ToolBarContainer.css"
import { useEditorState } from '../../../context/EditerStateContext';

export default function ToolBarContainer() {
  const { isEditMode, activeTool } = useEditorState();
  return (
    <div >
    <FullToolBar isEditMode={isEditMode} activeTool={activeTool}/>
    {/* <CompactToolBar activeTool={activeTool}/> */}
    </div>
  )
}
