
import { type Dispatch, type SetStateAction, type ReactNode, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Tipos
interface AuthToken {
  token: string;
  expiresAt: number;
}

export interface UserDetail {
  token: string;
  [key: string]: any; // Puedes reemplazar esto con una definición más estricta si conoces las claves
}

interface UserDetailContextType {
  userDetail: UserDetail | null;
  setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
  updateUserDetail: (updatedFields: Partial<UserDetail>) => void;
}

interface UserDetailProviderProps {
  children: ReactNode;
}

// Crear contexto
export const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);

export const UserDetailProvider: React.FC<UserDetailProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [userDetail, setUserDetail] = useState<UserDetail | null>(() => {
    const storedUser = localStorage.getItem("userDetail");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      try {
        const { token, expiresAt }: AuthToken = JSON.parse(storedToken);
        const now = Date.now();

        if (now < expiresAt) {
          return { ...JSON.parse(storedUser), token };
        } else {
          localStorage.removeItem("userDetail");
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Error parsing stored token/user:", error);
      }
    }

    return null;
  });

  useEffect(() => {
    if (userDetail) {
      localStorage.setItem("userDetail", JSON.stringify(userDetail));
      localStorage.setItem(
        "authToken",
        JSON.stringify({
          token: userDetail.token,
          expiresAt: Date.now() + 60 * 60 * 1000, // 60 minutos
        })
      );
    } else {
      localStorage.removeItem("userDetail");
      localStorage.removeItem("authToken");
    }
  }, [userDetail]);

  const updateUserDetail = (updatedFields: Partial<UserDetail>) => {
    setUserDetail((prev) => {
      if (!prev) return null;

      const updatedUser = { ...prev, ...updatedFields };

      const storedUser = JSON.parse(localStorage.getItem("userDetail") || "{}");
      localStorage.setItem(
        "userDetail",
        JSON.stringify({ ...storedUser, ...updatedFields })
      );

      return updatedUser;
    });
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        try {
          const { expiresAt }: AuthToken = JSON.parse(storedToken);
          const now = Date.now();

          if (now >= expiresAt) {
            setUserDetail(null);
            localStorage.removeItem("userDetail");
            localStorage.removeItem("authToken");
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.error("Error parsing token:", error);
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60 * 1000);
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, []);

  return (
    <UserDetailContext.Provider
      value={{ userDetail, setUserDetail, updateUserDetail }}
    >
      {children}
    </UserDetailContext.Provider>
  );
};
