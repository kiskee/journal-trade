import { BarChart3, Wallet, TrendingUp, FileText, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  onLogOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const IsMenuOpen = ({ onLogOut }: Props) => {
  return (
    <div className="lg:hidden border-t border-yellow-600/30 py-3 sm:py-4">
      <nav className="flex flex-col space-y-1 sm:space-y-2">
        <Link to="/inicio">
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
        </Link>
        <Link to="/portfolio">
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Portfolio</span>
          </button>
        </Link>
        <Link to="/analytics">
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
        </Link>
        <Link to="/notes">
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Notas</span>
          </button>
        </Link>
         <Link to="/accounts">
      <button className="w-full flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
        <FolderOpen className="w-5 h-5" />
        <span className="font-medium">Cuentas</span>
      </button>
    </Link> 
        <Link to="/trade">
          <button className="w-full mx-3 mt-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 text-black rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
            New Entry
          </button>
        </Link>
        <button
          className="w-full mx-3 mt-2 px-4 py-2.5 sm:py-3 bg-neutral-800 hover:bg-red-600 text-yellow-200 hover:text-white rounded-lg font-semibold transition-all duration-200 border border-yellow-600/30 hover:border-red-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          onClick={onLogOut}
        >
          LogOut
        </button>
      </nav>
    </div>
  );
};

export default IsMenuOpen;
