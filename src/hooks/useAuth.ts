import { UserDetailContext } from "@/context/UserDetailContext";
import { apiService } from "@/services/apiService";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  email: string;
  password: string;
  nombre?: string;
  apellidos?: string;
  usuario?: string;
  accounts?: any[];
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(UserDetailContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error(
      "UserDetailContext must be used within a UserDetailProvider"
    );
  }

  const { setUserDetail, userDetail } = context;

  const userAccounts = userDetail?.accounts || [];

  const authenticateUser = async (user: any, token: string) => {
    setUserDetail({
      ...user,
      token,
    });
    if (user.accounts && user.accounts.length > 0) {
      navigate("/inicio", { replace: true });
    } else {
      navigate("/create-account", { replace: true });
    }
  };

  const handleLogin = async (data: UserData) => {
    try {
      setIsLoading(true);
      const login = await apiService.post("/auth/login", data);
      await authenticateUser(login.user, login.accessToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: UserData) => {
    try {
      setIsLoading(true);
      const user = {
        email: data.email,
        family_name: data.apellidos,
        given_name: data.nombre,
        name: data.usuario,
        password: data.password,
      };

      const register = await apiService.post("/users", user);

      if (!register?.user?.id) {
        throw new Error("Error during register");
      }

      const loginParams = {
        email: data.email,
        password: data.password,
      };
      const login = await apiService.post("/auth/login", loginParams);

      await authenticateUser(login.user, login.accessToken);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const userInfo = await axios.get(
          import.meta.env.VITE_GOOGLE_SINGIN_URL,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const login = await apiService.post(
          "/auth/login-google",
          userInfo.data
        );

        await authenticateUser(login.user, login.accessToken);
      } catch (error) {
        console.error("Google login error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse: any) => {
      console.error("Google OAuth error:", errorResponse);
    },
  });

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await axios.get(
          import.meta.env.VITE_GOOGLE_SINGIN_URL,
          {
            headers: { Authorization: "Bearer " + tokenResponse?.access_token },
          }
        );

        const user = userInfo.data;

        //Enviar el registro con Google y obtener el JWT
        const login = await apiService.post("/auth/login-google", user);

        await authenticateUser(login.user, login.accessToken);
        // Guardar en el estado
      } catch (error) {
        console.error("Google login error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  const onLogOut = () => {
    googleLogout();
    setUserDetail(null);
    navigate("/", { replace: true });
  };

  return {
    isLoading,
    handleLogin,
    handleRegister,
    googleLogin,
    handleGoogleRegister,
    userDetail,
    setUserDetail,
    onLogOut,
    userAccounts,
  };
};
