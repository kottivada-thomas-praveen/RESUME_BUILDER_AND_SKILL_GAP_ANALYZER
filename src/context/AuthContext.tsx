import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { getToken, setToken, removeToken } from "../utils/token";
import { authService, type UserResponseData, type AuthResponseData } from "../services/authService";

export interface AuthContextType {
  user: UserResponseData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (authData: AuthResponseData) => void;
  logout: () => Promise<void>;
  updateUser: (userData: UserResponseData) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponseData | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            setTokenState(storedToken);
          } else {
            removeToken();
            setTokenState(null);
            setUser(null);
          }
        } catch {
          removeToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (authData: AuthResponseData) => {
    setToken(authData.token, authData.refreshToken);
    setTokenState(authData.token);
    setUser({
      id: authData.id,
      fullName: authData.fullName || authData.name || "",
      email: authData.email,
      role: authData.role,
      accountEnabled: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network failures on logout
    } finally {
      removeToken();
      setTokenState(null);
      setUser(null);
    }
  };

  const updateUser = (userData: UserResponseData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: tokenState,
        isAuthenticated: !!tokenState && !!user,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
