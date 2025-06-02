import {
  TrendingUp,
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
        console.log(user);
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
      console.log(login);
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
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Tarjeta de login */}
        <div className="bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden">
          {/* Header con logo y título */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/10 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Journal Kiss
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm">
              Accede a tu portal financiero
            </p>
          </div>

          {isLoading ? (
            <Loading text=" Cargando tu perfil, gracias por tu paciencia..."/>
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
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-lg text-sm">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>{errors.root.message}</span>
                      </div>
                    </div>
                  )}

                  {/* Campo Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-200">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500" />
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg bg-neutral-100 text-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                          errors.email
                            ? "border-rose-500 focus:ring-rose-500"
                            : "border-neutral-700 focus:ring-blue-600"
                        }`}
                        placeholder="usuario@financeapp.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-rose-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Campo Contraseña */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-200">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500" />
                      </div>
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-lg bg-neutral-100 text-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                          errors.password
                            ? "border-rose-500 focus:ring-rose-500"
                            : "border-neutral-700 focus:ring-blue-600"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 hover:text-neutral-400 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 hover:text-neutral-400 transition-colors" />
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
                              className="text-rose-500 text-xs flex items-center"
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
                        href="#"
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                  </div>

                  {/* Botón de login */}
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-100 group-hover:text-white transition-colors" />
                    </span>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </form>

                {/* Divisor */}
                <div className="mt-6 sm:mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-neutral-800 text-neutral-500">
                        O continúa con
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opciones de login social */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-neutral-700 rounded-lg shadow-sm bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-neutral-800 transition-colors"
                    onClick={() => googleLogin()}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Google
                  </button>
                </div>

                {/* Enlace para registro */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-500">
                    ¿No tienes una cuenta?
                    <a
                      href="/register"
                      className="font-medium text-blue-600 hover:text-blue-700 transition-colors ml-1"
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
            © 2025 Journal Kiss. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
