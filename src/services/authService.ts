import axiosInstance from "./axiosInstance";

export interface SignupPayload {
  fullName?: string;
  name?: string;
  email: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  name?: string;
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
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
    const displayName = payload.name || payload.fullName || "";
    const body = {
      ...payload,
      name: displayName,
      fullName: displayName,
    };
    const response = await axiosInstance.post<ApiResponse<AuthResponseData>>("/api/auth/signup", body);
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
    const displayName = payload.fullName || payload.name || "";
    const body = {
      ...payload,
      fullName: displayName,
      name: displayName,
    };
    const response = await axiosInstance.put<ApiResponse<UserResponseData>>("/api/auth/profile", body);
    return response.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post<ApiResponse<void>>("/api/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post<ApiResponse<void>>("/api/auth/reset-password", {
      token: payload.token,
      newPassword: payload.newPassword,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponseData>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponseData>>("/api/auth/refresh", {
      refreshToken,
      token: refreshToken,
    });
    return response.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post<ApiResponse<void>>("/api/auth/logout");
    return response.data;
  },
};

