import { BarChart3, Wallet, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  onLogOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const DesktopNav = ({ onLogOut }: Props) => {
  return (
    <>
      {/* Navegación desktop */}
     <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
        <Link to="/inicio">
          <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden xl:inline">Dashboard</span>
          </button>
        </Link>
        <Link to="/portfolio">
          <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
            <Wallet className="w-4 h-4" />
            <span className="hidden xl:inline">Portfolio</span>
          </button>
        </Link>
        <Link to="/analytics">
          <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden xl:inline">Analytics</span>
          </button>
        </Link>
        <Link to="/trade">
          <button className="px-3 xl:px-4 py-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 text-black rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer shadow-lg hover:shadow-yellow-500/25">
            <span className="hidden xl:inline">New Entry</span>
            <span className="xl:hidden">New</span>
          </button>
        </Link>
        <button
          className="px-3 xl:px-4 py-2 bg-neutral-800 hover:bg-red-600 text-yellow-200 hover:text-white rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer border border-yellow-600/30 hover:border-red-500"
          onClick={onLogOut}
        >
          <span className="hidden xl:inline">LogOut</span>
          <span className="xl:hidden">Out</span>
        </button>
      </nav>
    </>
  );
};

export default DesktopNav;
