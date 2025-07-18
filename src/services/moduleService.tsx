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
    byUser: (key: string, value: string) => Promise<TradeResponse>;
    lastTrade: (key: string, value: string) => Promise<TradeResponse>;
    delete: (id: string) => Promise<AxiosResponse<any, any>>;
  };
  strategies: {
    create: (data: any) => Promise<AxiosResponse<any, any>>;
    byUser: (key: string, value: string) => Promise<TradeResponse>;
  };
  images: {
    create: (data: any) => Promise<AxiosResponse<any, any>>;
  };
  news: {
    today: () => Promise<AxiosResponse<any, any>>;
  };
  notes: {
    create: (data: any) => Promise<AxiosResponse<any, any>>;
    byUser: (id: string) => Promise<NoteResponse[]>;
    delete: (id: string) => Promise<AxiosResponse<any, any>>;
    update: (id: string, data: any) => Promise<AxiosResponse<any, any>>;
  };
}

interface NoteResponse {
  content: string;
  date: string;
  id: string;
  sentiment: string;
  tags: string[];
  title: string;
  update: string;
  user: string;
}

interface TradeResponse {
  count: number;
  results: any[];
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
        //config.headers.set("Content-Type", "application/json")
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
    create: async (data: any) => {
      const response = await apiClient.post("/trades", data);
      return response;
    },
    byUser: async (key: string, value: string): Promise<TradeResponse> => {
      const response: AxiosResponse<TradeResponse> = await apiClient.get(
        "/trades/search/find",
        {
          params: { key, value },
        }
      );
      return response.data;
    },
    lastTrade: async (key: string, value: string): Promise<TradeResponse> => {
      const response: AxiosResponse<TradeResponse> = await apiClient.get(
        "/trades/search/latest",
        {
          params: { key, value },
        }
      );
      return response.data;
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/trades/${id}`);
      return response;
    },
  },
  strategies: {
    create: async (data: any) => {
      const response = await apiClient.post("/strategies", data);
      return response;
    },
    byUser: async (key: string, value: string): Promise<TradeResponse> => {
      const response: AxiosResponse<TradeResponse> = await apiClient.get(
        "/strategies/search/find",
        {
          params: { key, value },
        }
      );
      return response.data;
    },
  },
  images: {
    create: async (data: any) => {
      const response = await apiClient.post("/images/upload", data);
      return response;
    },
  },
  news: {
    today: async () => {
      const response = await apiClient.get("/news/today");
      return response;
    },
  },
  notes: {
    create: async (data: any) => {
      const response = await apiClient.post("/notes", data);
      return response;
    },
    byUser: async (id: string): Promise<any> => {
      const response: AxiosResponse<any> = await apiClient.get(
        `/notes/user/${id}`
      );
      return response.data;
    },
    delete: async (id: string) => {
      const response = await apiClient.delete(`/notes/${id}`);
      return response;
    },
    update:async (id: string, data: any) => {
      const response = await apiClient.put(`/notes/${id}`, data);
      return response;
    },
  },
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
