const getCursorStyle = (tool: string | null) => {
  switch (tool) {
    case "pen":    return "crosshair";
    case "eraser": return "cell";
    case "text":   return "text";
    case "pan":    return "grab";
    default:       return "default";
  }
};

export {getCursorStyle}