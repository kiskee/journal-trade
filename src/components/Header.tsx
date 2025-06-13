import { useContext, useState, type JSX } from "react";
import {
  // Bell,
  Search,
  Settings,
  Menu,
  X,
  TrendingUp,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { UserDetailContext } from "../context/UserDetailContext";

export default function Header(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  //const [notifications] = useState<number>(3);
  const navigate = useNavigate();
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }

  const { setUserDetail, userDetail } = context;

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // si necesitas evitar recarga por algún motivo
    googleLogout();
    setUserDetail(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full bg-neutral-900 border-b border-neutral-800 fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo y título */}
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

          {/* Navegación desktop */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
           <Link to="/inicio">
            <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors text-sm cursor-pointer">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden xl:inline">Dashboard</span>
            </button>
            </Link>
            <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors text-sm cursor-pointer">
              <Wallet className="w-4 h-4" />
              <span className="hidden xl:inline">Portfolio</span>
            </button>
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

          {/* Área derecha con iconos y avatar */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Buscador - oculto en mobile muy pequeño */}
            {/* <button className="hidden sm:block p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button> */}

            {/* Notificaciones */}
            {/* <button className="relative p-1.5 sm:p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {notifications > 0 && (
                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button> */}

            {/* Configuraciones - oculto en mobile pequeño */}
            {/* <button className="hidden md:block p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button> */}

            {/* Avatar */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <img
                  src={userDetail?.picture}
                  alt="Avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neutral-700 hover:border-blue-500 transition-colors"
                />

                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-neutral-900 rounded-full"></div>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-white">
                  {userDetail?.name}
                </p>
                <p className="text-xs text-neutral-400">{userDetail?.email}</p>
              </div>
            </div>

            {/* Menú hamburguesa para móvil */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-1.5 sm:p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors ml-1 sm:ml-2"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 py-3 sm:py-4">
            <nav className="flex flex-col space-y-1 sm:space-y-2">
              <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors">
                <Wallet className="w-5 h-5" />
                <span>Portfolio</span>
              </button>
              <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors sm:hidden">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
              <button className="flex items-center space-x-3 px-3 py-2.5 sm:py-3 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors md:hidden">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="mx-3 mt-2 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                New Entry
              </button>
              <button
                className="mx-3 mt-2 px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                onClick={onLogOut}
              >
                LogOut
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Barra de progreso de mercado */}
      {/* <div className="bg-neutral-800 px-3 sm:px-4 md:px-6 lg:px-8 py-2">
        <div className="w-full flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
            <span className="text-neutral-400 hidden sm:inline">Market Status:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-emerald-400 font-medium">Open</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4 overflow-hidden">
              <span className="text-neutral-400">S&P:</span>
              <span className="text-emerald-400 font-medium">+0.85%</span>
              <span className="text-neutral-400 hidden lg:inline">NASDAQ:</span>
              <span className="text-rose-400 font-medium hidden lg:inline">-0.23%</span>
            </div>
          </div>
          <div className="text-neutral-500 text-xs flex-shrink-0">
            <span className="hidden sm:inline">Last updated: </span>2m ago
          </div>
        </div>
      </div> */}
    </div>
  );
}
