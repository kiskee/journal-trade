import { BarChart3, Wallet, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  onLogOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const IsMenuOpen = ({ onLogOut }: Props) => {
  return (
    <div className="lg:hidden border-t border-neutral-800 py-3 sm:py-4">
      <nav className="flex flex-col space-y-1 sm:space-y-2">
        <Link to="/inicio">
          <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </Link>
        <Link to="/portfolio">
          <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors">
            <Wallet className="w-5 h-5" />
            <span>Portfolio</span>
          </button>
        </Link>
        <Link to="/analytics">
          <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </Link>
        <Link to="/trade">
          <button className="mx-3 mt-2 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            New Entry
          </button>
        </Link>
        <button
          className="mx-3 mt-2 px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          onClick={onLogOut}
        >
          LogOut
        </button>
      </nav>
    </div>
  );
};

export default IsMenuOpen;
