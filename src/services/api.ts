import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DailyLog {
  id: number;
  userId: number;
  mood: number;
  anxietyLevel?: number;
  sleepHours?: number;
  sleepQuality?: string;
  sleepDisturbances?: string;
  physicalActivityType?: string;
  physicalActivityDuration?: number;
  socialInteractions?: number;
  stressLevel?: number;
  depressionSymptoms?: string;
  anxietySymptoms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/google", { token });
    return response.data;
  },
};

export const dailyLogService = {
  create: async (
    data: Omit<DailyLog, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    const response = await api.post<DailyLog>("/daily-logs", data);
    return response.data;
  },

  getAll: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const response = await api.get<DailyLog[]>(
      `/daily-logs?${params.toString()}`
    );
    return response.data;
  },

  update: async (id: number, data: Partial<DailyLog>) => {
    const response = await api.put<DailyLog>(`/daily-logs/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/daily-logs/${id}`);
    return response.data;
  },
};
