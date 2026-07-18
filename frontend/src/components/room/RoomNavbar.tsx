import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface RoomNavbarProps {
  roomId: string;
}

export default function RoomNavbar({ roomId }: RoomNavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-[#101820] text-white">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg tracking-tight">Syncvas</span>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 border border-white/15 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied!" : `Room: ${roomId}`}
      </button>
    </div>
  );
}