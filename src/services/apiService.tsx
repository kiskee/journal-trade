// Tipos para las respuestas de la API
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: any;
}

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestHeaders = Record<string, string>;

const BASE_URL: string = import.meta.env.VITE_API_URL; // Asegúrate de definirlo en tus variables de entorno

const handleResponse = async <T = any>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw errorData; // Lanzamos el objeto de error completo, no solo como string
  }
  return response.json() as Promise<T>;
};

const getToken = (): string | null => localStorage.getItem("jwtToken");

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const [, payload] = token.split(".");
    if (!payload) return false;
    
    const decodedPayload: JwtPayload = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return decodedPayload.exp ? decodedPayload.exp > currentTime : false;
  } catch {
    return false;
  }
};

export const apiService = {
  get: async <T = any>(
    url: string, 
    headers: RequestHeaders = {}
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return handleResponse<T>(response);
  },

  post: async <T = any>(
    url: string, 
    body: any, 
    headers: RequestHeaders = {}
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  put: async <T = any>(
    url: string, 
    body: any, 
    headers: RequestHeaders = {}
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  delete: async <T = any>(
    url: string, 
    headers: RequestHeaders = {}
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return handleResponse<T>(response);
  },

  withAuth: async <T = any>(
    method: HttpMethod, 
    url: string, 
    body: any = null, 
    additionalHeaders: RequestHeaders = {}
  ): Promise<T | void> => {
    const token = getToken();
    
    // Valida si el token es válido
    if (!isTokenValid(token)) {
      console.error("Token inválido o expirado. Redirigiendo al login...");
      window.location.href = "/login"; // Ajusta la redirección según tu aplicación
      return;
    }

    const headers: RequestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...additionalHeaders,
    };

    // Llama al método correspondiente (GET, POST, etc.)
    if (method === "GET" || method === "DELETE") {
      return fetch(`${BASE_URL}${url}`, {
        method,
        headers,
      }).then(response => handleResponse<T>(response));
    } else if (method === "POST" || method === "PUT") {
      return fetch(`${BASE_URL}${url}`, {
        method,
        headers,
        body: JSON.stringify(body),
      }).then(response => handleResponse<T>(response));
    } else {
      throw new Error("Método HTTP no soportado.");
    }
  },
};