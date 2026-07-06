import FullToolBar from './Layouts/FullToolBar'
import CompactToolBar from './Layouts/CompactToolBar'
import "./ToolBarContainer.css"
import { useToolSettings } from '../../../context/ToolBarLeftContext';


export default function ToolBarContainer() {
  const { activeTool } = useToolSettings();
  const displayTool = activeTool;

  return (
    <div>
      <FullToolBar displayTool={displayTool} />
      {/* <CompactToolBar displayTool={displayTool} /> */}
    </div>
  )
}