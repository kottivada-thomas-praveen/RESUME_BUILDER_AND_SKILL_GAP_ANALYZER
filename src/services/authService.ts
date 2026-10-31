import axiosInstance from "./axiosInstance";

export interface SignupPayload {
  fullName: string;
  email: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  email: string;
}

export interface UserResponseData {
  id: number;
  fullName: string;
  email: string;
  role: string;
  accountEnabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  id: number;
  fullName: string;
  name?: string;
  email: string;
  role: string;
  refreshToken?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  async signup(payload: SignupPayload): Promise<ApiResponse<AuthResponseData>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponseData>>("/api/auth/signup", payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponseData>>("/api/auth/login", payload);
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<UserResponseData>> {
    const response = await axiosInstance.get<ApiResponse<UserResponseData>>("/api/auth/me");
    return response.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<UserResponseData>> {
    const response = await axiosInstance.put<ApiResponse<UserResponseData>>("/api/auth/profile", payload);
    return response.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post<ApiResponse<void>>("/api/auth/logout");
    return response.data;
  },
};
