import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  Mail,
} from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserDetailContext } from "../context/UserDetailContext";
import { apiService } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { formSchemaLogin } from "./utils/Shemas";
import Loading from "./utils/Loading";
import toro from "../assets/toro.png";

interface UserData {
  email: string;
  password: string;
}

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(UserDetailContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error(
      "UserDetailContext debe usarse dentro de un UserDetailProvider"
    );
  }

  const { setUserDetail } = context;

  const form = useForm({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = form;

  const googleLogin = useGoogleLogin({
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

        //Enviar el login y obtener el JWT
        const login = await apiService.post("/auth/login-google", user);

        // Guardar en el estado y localStorage
        setUserDetail({
          ...login.user,
          token: login.accessToken, // Suponiendo que tu API devuelve el token como `jwtToken`
        });
        setIsLoading(false);
      } catch (error) {
        //setError(error.error || error.message || "Error desconocido");

        setError("root", {
          type: "manual",
          message: "Credenciales incorrectas. Intenta nuevamente.",
        });
      } finally {
        setIsLoading(false);
        navigate("/inicio", { replace: true });
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  const onSubmit = async (data: UserData) => {
    try {
      setIsLoading(true);
      clearErrors();

      const user = data;

      const login = await apiService.post("/auth/login", user);
      setUserDetail({
        ...login.user,
        token: login.accessToken,
      });
    } catch (error) {
      // Si hay error de la API, mostrar el error
      setError("root", {
        type: "manual",
        message: "Credenciales incorrectas. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
      navigate("/inicio", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-black to-yellow-800/10"></div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Tarjeta de login */}
        <div className="bg-neutral-950 rounded-2xl shadow-2xl border border-yellow-600/30 overflow-hidden backdrop-blur-sm">
          {/* Header con logo y título */}

          <div className="p-6 sm:p-8 text-center bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-black/10 p-2 rounded-full shadow-lg">
                <img
                  src={toro}
                  alt="LØNNSOM Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain filter drop-shadow-md"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2 drop-shadow-sm">
              LØNNSOM Tracker
            </h1>
            <p className="text-black/80 text-xs sm:text-sm font-medium">
              Desfragmentador de Traders
            </p>
          </div>

          {isLoading ? (
            <Loading text="Cargando tu perfil, gracias por tu paciencia..." />
          ) : (
            <>
              {/* Formulario */}
              <div className="p-6 sm:p-8">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Error general del formulario */}
                  {errors.root && (
                    <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>{errors.root.message}</span>
                      </div>
                    </div>
                  )}

                  {/* Campo Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg bg-neutral-900 text-yellow-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-yellow-600/30 focus:ring-yellow-500"
                        }`}
                        placeholder="usuario@lonnsom.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Campo Contraseña */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                      </div>
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-lg bg-neutral-900 text-yellow-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-yellow-600/30 focus:ring-yellow-500"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 hover:text-yellow-400 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 hover:text-yellow-400 transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors?.password?.message && (
                      <div className="space-y-1">
                        {errors.password.message
                          .split(". ")
                          .map((msg, index) => (
                            <p
                              key={index}
                              className="text-red-400 text-xs flex items-center"
                            >
                              <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                              {msg}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Recordar sesión y olvidé contraseña */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-3 sm:space-y-0">
                    <div className="text-sm">
                      <a
                        href="/reset-password"
                        className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                  </div>

                  {/* Botón de login */}
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="group relative bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                    </span>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </form>

                {/* Divisor */}
                <div className="mt-6 sm:mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-yellow-600/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-neutral-950 text-yellow-400">
                        O continúa con
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opciones de login social */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-yellow-600/30 rounded-lg shadow-sm bg-neutral-900 text-yellow-100 text-sm font-medium hover:bg-neutral-800 hover:border-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-black transition-all duration-200"
                    onClick={() => googleLogin()}
                  >
                    <Mail className="h-4 w-4 mr-2 text-yellow-400" />
                    Google
                  </button>
                </div>

                {/* Enlace para registro */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-400">
                    ¿No tienes una cuenta?
                    <a
                      href="/register"
                      className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors ml-1"
                    >
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            © 2025 LØNNSOM Tracker. Todos los derechos reservados.
          </p>
          <p className="text-xs text-yellow-600/60 mt-1">
            Desfragmentador de Traders
          </p>
        </div>
      </div>
    </div>
  );
};
