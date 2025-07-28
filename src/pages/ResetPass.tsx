import { useState } from "react";
import toro from "../assets/toro.png";
import { apiService } from "@/services/apiService";

export default function ResetPass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const requestToken = await apiService.post(
        `/auth/forgot-password/${email}`,
        {}
      );
      //console.log(requestToken)
      if (requestToken.resetToken || requestToken.resetToken != "") {
        setToken(requestToken.resetToken);
        setStep(2);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dataToSend = {
        token,
        code,
        newPassword,
        email,
      };

      const response = await apiService.post(
        `/auth/reset-password`,
        dataToSend
      );

      if (
        response.message &&
        response.message == "Contraseña actualizada exitosamente"
      ) {
        setStep(3);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cambiar la contraseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Fondo con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-black to-yellow-800/10"></div>

        {/* Contenedor principal */}
        <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Tarjeta de reset password */}
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

            {/* Contenido */}
            <div className="p-6 sm:p-8">
              {/* Step 1: Email Input */}
              {step === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-yellow-100 mb-2">
                      Recuperar Contraseña
                    </h2>
                    <p className="text-neutral-400 text-xs sm:text-sm">
                      Ingresa tu correo electrónico para recibir el código de
                      verificación
                    </p>
                    {error && (
                      <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mt-4">
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-yellow-600/30 rounded-lg bg-neutral-900 text-yellow-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="usuario@lonnsom.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleEmailSubmit}
                    disabled={loading}
                    className="group relative bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando...
                      </div>
                    ) : (
                      "Enviar Código"
                    )}
                  </button>

                  <div className="text-center">
                    <a
                      href="/"
                      className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                    >
                      ← Volver al inicio de sesión
                    </a>
                  </div>
                </div>
              )}

              {/* Step 2: Code and New Password */}
              {step === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-yellow-100 mb-2">
                      Verificar Código
                    </h2>
                    <p className="text-neutral-400 text-xs sm:text-sm">
                      Hemos enviado un código de verificación a{" "}
                      <span className="text-yellow-400">{email}</span>
                    </p>
                    {error && (
                      <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mt-4">
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      Código de Verificación
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="block w-full px-4 py-2.5 sm:py-3 border border-yellow-600/30 rounded-lg bg-neutral-900 text-yellow-100 text-center text-lg tracking-widest placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="000000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-yellow-600/30 rounded-lg bg-neutral-900 text-yellow-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 hover:text-yellow-400 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          {showPassword ? (
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                          ) : (
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-yellow-600/30 rounded-lg bg-neutral-900 text-yellow-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 hover:text-yellow-400 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          {showConfirmPassword ? (
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                          ) : (
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="group relative bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Cambiando contraseña...
                      </div>
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError("");
                      }}
                      className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                    >
                      ← Cambiar correo electrónico
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center border border-green-500/30">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-yellow-100 mb-2">
                      ¡Contraseña Cambiada!
                    </h2>
                    <p className="text-neutral-400 text-xs sm:text-sm">
                      Tu contraseña ha sido actualizada exitosamente
                    </p>
                  </div>

                  <button
                    onClick={() => (window.location.href = "/")}
                    className="group relative bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-black transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>
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
    </>
  );
}
