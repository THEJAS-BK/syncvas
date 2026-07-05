import FullToolBar from './Layouts/FullToolBar'
import CompactToolBar from './Layouts/CompactToolBar'
import "./ToolBarContainer.css"
import { useEditorState } from '../../../context/EditerStateContext';

export default function ToolBarContainer() {
  const { activeTool, editModeTool } = useEditorState();
  const displayTool = editModeTool ?? activeTool;

  return (
    <div>
      <FullToolBar displayTool={displayTool} />
      {/* <CompactToolBar displayTool={displayTool} /> */}
    </div>
  )
}