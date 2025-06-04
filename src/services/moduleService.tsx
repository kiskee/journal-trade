import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";


// interface ResetPasswordData {
//   email: string;
//   password: string;
//   // Agrega otros campos si es necesario
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   // Agrega más campos si tu modelo de usuario los tiene
// }

interface ModuleServiceType {
//   password: {
//     find: (email: string) => Promise<any>;
//     reset: (data: ResetPasswordData) => Promise<any>;
//   };
//   users: {
//     getAll: () => Promise<User[]>;
//     getById: (id: string) => Promise<User>;
//     update: (id: string, data: Partial<User>) => Promise<User>;
//     remove: (id: string) => Promise<{ success: boolean }>;
//   };
  trades: {
    create: (data: any) => Promise<AxiosResponse<any, any>>;
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

// Interceptor para agregar el token al header de cada solicitud
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const tokenData = localStorage.getItem("authToken");

    if (tokenData) {
      const parsed = JSON.parse(tokenData) as { token: string };
      if (parsed.token) {
        config.headers.set("Authorization", `Bearer ${parsed.token}`);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ModuleService: ModuleServiceType = {

    trades: {
        create: async(data:any) =>{
            const response = await apiClient.post('/trades', data)
            return response
        }
    }
//   password: {
//     find: async (email: string): Promise<any> => {
//       const response = await apiClient.post(`/auth/forgot-password/${email}`);
//       return response.data;
//     },
//     reset: async (data: ResetPasswordData): Promise<any> => {
//       const response = await apiClient.post(`/auth/reset-password`, data);
//       return response.data;
//     },
//   },
//   users: {
//     getAll: async (): Promise<User[]> => {
//       const response = await apiClient.get("/users");
//       return response.data;
//     },
//     getById: async (id: string): Promise<User> => {
//       const response = await apiClient.get(`/users/${id}`);
//       return response.data;
//     },
//     update: async (id: string, data: Partial<User>): Promise<User> => {
//       const response = await apiClient.put(`/users/${id}`, data);
//       return response.data;
//     },
//     remove: async (id: string): Promise<{ success: boolean }> => {
//       await apiClient.delete(`/users/${id}`);
//       return { success: true };
//     },
//   },
};

export default ModuleService;
