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

// Session-level user cache key — stored in sessionStorage so it clears on tab/browser close.
// This avoids calling /api/auth/me on every page navigation/refresh, which was the primary
// cause of the "Verifying Session..." spinner delay (300–800ms) on every protected route visit.
const USER_CACHE_KEY = "auth_user_cache";

function getCachedUser(): UserResponseData | null {
  try {
    const raw = sessionStorage.getItem(USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as UserResponseData) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: UserResponseData | null) {
  try {
    if (user) {
      sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_CACHE_KEY);
    }
  } catch {
    // sessionStorage might be unavailable in private mode — ignore silently.
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponseData | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        // No token at all — user is not logged in. Skip network call immediately.
        setLoading(false);
        return;
      }

      // Check session-level cache first. If we already validated this session, skip /me.
      const cachedUser = getCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
        setTokenState(storedToken);
        setLoading(false);
        return;
      }

      // No cache — perform one-time validation against /api/auth/me.
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          setTokenState(storedToken);
          setCachedUser(response.data);
        } else {
          removeToken();
          setCachedUser(null);
          setTokenState(null);
          setUser(null);
        }
      } catch {
        removeToken();
        setCachedUser(null);
        setTokenState(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (authData: AuthResponseData) => {
    setToken(authData.token, authData.refreshToken);
    setTokenState(authData.token);
    const userData: UserResponseData = {
      id: authData.id,
      fullName: authData.fullName || authData.name || "",
      email: authData.email,
      role: authData.role,
      accountEnabled: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(userData);
    // Cache the user so subsequent page navigations don't re-call /api/auth/me.
    setCachedUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network failures on logout
    } finally {
      removeToken();
      setCachedUser(null);
      setTokenState(null);
      setUser(null);
    }
  };

  const updateUser = (userData: UserResponseData) => {
    setUser(userData);
    setCachedUser(userData);
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
