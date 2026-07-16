
import {Menu} from "lucide-react"
import { useState } from "react";
export default function OfflineHamberMenu() {

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="absolute top-16 left-5 bg-[#1e1e2e] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[220px] z-20">
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
    </div>
  );
}
