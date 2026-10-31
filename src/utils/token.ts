const TOKEN_KEY = "jwt_auth_token";
const REFRESH_TOKEN_KEY = "jwt_refresh_token";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
};

export const setToken = (token: string, refreshToken?: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("token", token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};
