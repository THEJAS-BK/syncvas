import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyBoards() {
  return (
    <div className="max-w-5xl mx-auto mt-36 px-10 pb-24 pt-4 text-center">
      <h2 className="text-5xl font-semibold text-[#101820]">My boards</h2>
      <p className="text-gray-500 mt-2 mb-10">
        Boards you create will show up here.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 justify-center">
        <Link to="/offlineboard">
          <div className="aspect-[3/2] border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500">New board</span>
          </div>
        </Link>
      </div>
    </div>
  );
}