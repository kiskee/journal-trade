import { useContext, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import LogTitle from "./LogTitle";
import DesktopNav from "./DesktopNav";
import IconsAvatar from "./IconsAvatar";
import IsMenuOpen from "./IsMenuOpen";

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
          <LogTitle />

          {/* Navegación desktop */}
          <DesktopNav onLogOut={onLogOut} />

          {/* Área derecha con iconos y avatar */}
          <IconsAvatar
            userDetail={userDetail}
            toggleMenu={toggleMenu}
            isMenuOpen={isMenuOpen}
          />
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && <IsMenuOpen onLogOut={onLogOut} />}
      </div>
    </div>
  );
}
