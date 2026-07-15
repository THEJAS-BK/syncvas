import { Copy } from "lucide-react";
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
    <div className="h-16 flex items-center justify-between px-6 bg-gray-900 text-white">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">Syncvas</span>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md text-sm transition-colors"
      >
        <Copy size={16} />
        {copied ? "Copied!" : `Room: ${roomId}`}
      </button>
    </div>
  );
}