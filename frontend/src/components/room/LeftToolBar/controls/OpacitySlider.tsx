import React from 'react'

export default function OpacitySlider() {
  return (
   <div className="flex flex-col gap-1">
  <span className="text-sm text-white">Opacity</span>
  <input
    type="range"
    min={0}
    max={100}
    className="
      w-full h-1 rounded-full
      appearance-none cursor-pointer
      bg-[#3d3d5c]
      range-thumb:w-4 range-thumb:h-4
      range-thumb:rounded-full
      range-thumb:bg-[#7c7cad]
      range-thumb:border-none
    "
  />
  <div className="flex justify-between text-xs text-gray-400">
    <span>0</span>
    <span>100</span>
  </div>
</div>
  )
}
