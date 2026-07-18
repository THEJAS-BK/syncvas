
export function autoPanIfNeeded(
  camera: React.RefObject<{ x: number; y: number; scale: number }>,
  textareaRight: number,
  textareaBottom: number,
  onPan: () => void, 
   doRedraw: () => void,
): boolean {
  const margin = 40;
  let panned = false;

  if (textareaRight > window.innerWidth - margin) {
    const overflow = textareaRight - (window.innerWidth - margin);
    camera.current.x -= overflow;
    panned = true;
  }

  if (textareaBottom > window.innerHeight - margin) {
    const overflow = textareaBottom - (window.innerHeight - margin);
    camera.current.y -= overflow;
    panned = true;
  }

  if (panned) {
  doRedraw();
    onPan();
  }

  return panned;
}
