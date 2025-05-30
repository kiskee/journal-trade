// helpers/tokenValidator.ts

interface TokenPayload {
  exp?: number;
  [key: string]: unknown;
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false; // El token no existe
  }

  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return false; // Token mal formado
    }

    const decodedPayload: TokenPayload = JSON.parse(atob(payload));

    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      return false; // El token ha expirado
    }

    return true; // El token es válido
  } catch (error) {
    console.error("Error al validar el token:", error);
    return false; // Cualquier error invalida el token
  }
};
