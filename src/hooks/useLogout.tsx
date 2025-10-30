import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";


export const useLogout = () => {
  const navigate = useNavigate();
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }

  const { setUserDetail } = context;

  const handleLogout = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }
    
    googleLogout();
    setUserDetail(null);
    navigate("/", { replace: true });
  };

  return { handleLogout };
};