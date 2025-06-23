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
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neutral-700 hover:border-blue-500 transition-colors"
          />

          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-neutral-900 rounded-full"></div>
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-white">{userDetail?.name}</p>
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
  );
};

export default IconsAvatar;
