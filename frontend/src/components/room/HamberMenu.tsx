import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface HamberMenuProps {
  roomId: string;
}

export default function HamberMenu({ roomId }: HamberMenuProps) {
  return (
    <div className="absolute top-16 left-5 bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[220px] z-20">
      {/* Room ID */}
      <div className="px-4 py-3 border-b border-white/10">
        <span className="text-xs text-gray-400">Room ID</span>
        <p className="text-sm text-gray-200 font-mono truncate">{roomId}</p>
      </div>

      {/* Actions */}
      <ul className="py-1">
        <li className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors">
          My Boards
        </li>
        <li className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 cursor-pointer transition-colors">
          Save Board
        </li>
        <li className="px-4 py-2 text-sm text-red-400 hover:bg-white/10 cursor-pointer transition-colors">
          Exit
        </li>
      </ul>

      {/* Social links */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-white/10">
        <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
          <FaGithub size={18} />
        </div>
        <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
          <Mail size={18} />
        </div>
        <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
          <FaLinkedin size={18} />
        </div>
      </div>
    </div>
  );
}