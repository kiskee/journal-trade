import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const LogTitle = () => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Link to="/">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
        </Link>
        <Link to="/">
          <h1 className="text-base sm:text-xl font-bold text-white truncate">
            <span className="hidden sm:inline">J </span>
            <span className="sm:hidden">J</span>
            <span className="text-blue-400"> - Kiss</span>
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default LogTitle;
