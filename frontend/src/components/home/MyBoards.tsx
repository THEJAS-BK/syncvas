import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
export default function MyBoards() {

  return (
    <div className="h-full p-10">
      <h2 className="text-7xl mb-10">My boards</h2>

      <Link to="/offlineboard" >
      <div
        className="w-90 h-60 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
      >
        <Plus className="w-8 h-8 text-gray-500" />
      </div>
      </Link>
    </div>
  );
}
