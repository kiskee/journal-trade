import type { UserDetail } from "@/context/UserDetailContext";
import { X, Menu } from "lucide-react";

type Props = {
  userDetail: UserDetail | null;
  toggleMenu: () => void;
  isMenuOpen: boolean
}

const IconsAvatar = ({ userDetail, toggleMenu, isMenuOpen }: Props) => {
  return (
   <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
      {/* Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="relative">
          <img
            src={userDetail?.picture}
            alt="Avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-yellow-600/50 hover:border-yellow-400 transition-colors shadow-lg"
          />

          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-black rounded-full shadow-sm"></div>
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-yellow-100">{userDetail?.name}</p>
          <p className="text-xs text-yellow-300/70">{userDetail?.email}</p>
        </div>
      </div>

      {/* Menú hamburguesa para móvil */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-1.5 sm:p-2 text-yellow-400 hover:text-yellow-200 hover:bg-yellow-600/20 rounded-lg transition-colors ml-1 sm:ml-2 border border-yellow-600/30 hover:border-yellow-500/50"
      >
        {isMenuOpen ? (
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
    </div>
  );
};

export default IconsAvatar;
