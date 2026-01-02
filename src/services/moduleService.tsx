import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

interface ModuleServiceType {
  trades: {
    create: (data: any) => Promise<AxiosResponse<any, any>>;
    byUser: (key: string, value: string) => Promise<TradeResponse>;
    lastTrade: (key: string, value: string) => Promise<TradeResponse>;
    delete: (id: string) => Promise<AxiosResponse<any, any>>;
    update: (id: string, data: any) => Promise<AxiosResponse<any, any>>;
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
  upsala: {
    create: (data: any) => Promise<AxiosResponse<any, any>>;
    byUser: (id: string) => Promise<RegistryResponse>;
  };
  accounts: {
    byUser: () => Promise<Account[] | string>;
    create: (data: any) => Promise<AxiosResponse<any, any>>;
    update: (accountId: string, data: any) => Promise<AxiosResponse<any, any>>;
  };
  analysis: {
    create: (data: any) => Promise<AxiosResponse<any, any>>;
    getAll: () => Promise<AxiosResponse<any, any>>;
    getLatest: () => Promise<AxiosResponse<any, any>>;
    getById: (reportId: string) => Promise<AxiosResponse<any, any>>;
    update: (reportId: string, data: any) => Promise<AxiosResponse<any, any>>;
    delete: (reportId: string) => Promise<AxiosResponse<any, any>>;
  };
}
interface Account {
  id: string;
  isprimary: boolean;
  createdAt: Date;
  updatedAt: Date;
  currentBalance: number;
  name: string;
  userId: string;
  initialBalance: number;
  currency: string;
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

interface RegistryResponse {
  data: DataRegistry[];
  error: boolean;
  message: string;
}

interface DataRegistry {
  date: string;
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
    update: async (id: string, data: any) => {
      const response = await apiClient.put(`/trades/${id}`, data);
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
    update: async (id: string, data: any) => {
      const response = await apiClient.put(`/notes/${id}`, data);
      return response;
    },
  },
  upsala: {
    create: async (data: any) => {
      const response = await apiClient.post("/upsala", data);
      return response;
    },
    byUser: async (id: string): Promise<any> => {
      const response: AxiosResponse<any> = await apiClient.get(`/upsala/${id}`);
      return response.data;
    },
  },
  accounts: {
    byUser: async (): Promise<any> => {
      const response: AxiosResponse<any> = await apiClient.get(`/accounts`);
      return response;
    },
    create: async (data: any) => {
      const response = await apiClient.post("/accounts", data);
      return response;
    },
    update: async (accountId: string, data: any) => {
      const response = await apiClient.put(`/accounts/${accountId}`, data);
      return response;
    },
  },
  analysis: {
    create: async (data: any) => {
      const response = await apiClient.post("/analysis", data);
      return response;
    },
    getAll: async () => {
      const response = await apiClient.get("/analysis");
      return response;
    },
    getLatest: async () => {
      const response = await apiClient.get("/analysis/latest");
      return response;
    },
    getById: async (reportId: string) => {
      const response = await apiClient.get(`/analysis/${reportId}`);
      return response;
    },
    update: async (reportId: string, data: any) => {
      const response = await apiClient.put(`/analysis/${reportId}`, data);
      return response;
    },
    delete: async (reportId: string) => {
      const response = await apiClient.delete(`/analysis/${reportId}`);
      return response;
    },
  },
};

export default ModuleService;
