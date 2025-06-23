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
          <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors text-sm cursor-pointer">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden xl:inline">Dashboard</span>
          </button>
        </Link>
        <Link to="/portfolio">
          <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors text-sm cursor-pointer">
            <Wallet className="w-4 h-4" />
            <span className="hidden xl:inline">Portfolio</span>
          </button>
        </Link>
        <Link to="/analytics">
          <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors text-sm cursor-pointer">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden xl:inline">Analytics</span>
          </button>
        </Link>
        <Link to="/trade">
          <button className="px-3 xl:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm cursor-pointer">
            <span className="hidden xl:inline">New Entry</span>
            <span className="xl:hidden">New</span>
          </button>
        </Link>
        <button
          className="px-3 xl:px-4 py-2 bg-red-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm cursor-pointer"
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
