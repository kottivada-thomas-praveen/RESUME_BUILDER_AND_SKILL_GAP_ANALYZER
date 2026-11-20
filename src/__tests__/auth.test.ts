import { describe, it, expect, beforeEach, vi } from "vitest";

// Lightweight browser localStorage mock for Node test runner
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();
(globalThis as any).localStorage = mockStorage;
(globalThis as any).sessionStorage = mockStorage;

import { getToken, setToken, removeToken, getRefreshToken } from "../utils/token";
import { authService } from "../services/authService";
import axiosInstance from "../services/axiosInstance";

describe("Frontend Authentication & Token Management Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("1. Token storage: saves access token and refresh token correctly", () => {
    const testAccessToken = "mock.jwt.access.token";
    const testRefreshToken = "mock.jwt.refresh.token";

    setToken(testAccessToken, testRefreshToken);

    expect(getToken()).toBe(testAccessToken);
    expect(getRefreshToken()).toBe(testRefreshToken);
    expect(localStorage.getItem("token")).toBe(testAccessToken);
  });

  it("2. Token retrieval: reads legacy token key if jwt_auth_token is missing", () => {
    localStorage.setItem("token", "legacy.jwt.token");
    expect(getToken()).toBe("legacy.jwt.token");
  });

  it("3. Token removal: completely purges all auth tokens on logout", () => {
    setToken("access.token", "refresh.token");
    expect(getToken()).not.toBeNull();

    removeToken();

    expect(getToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("4. Empty state: returns null when no tokens are present", () => {
    expect(getToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("5. authService.signup: dispatches correct normalized payload", async () => {
    const postSpy = vi.spyOn(axiosInstance, "post").mockResolvedValueOnce({
      data: {
        success: true,
        message: "User registered successfully",
        data: {
          token: "jwt.token.here",
          refreshToken: "jwt.refresh.here",
          id: 1,
          fullName: "John Doe",
          name: "John Doe",
          email: "john@example.com",
          role: "USER",
        },
      },
    });

    const result = await authService.signup({
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(postSpy).toHaveBeenCalledWith(
      "/api/auth/signup",
      expect.objectContaining({
        fullName: "John Doe",
        name: "John Doe",
        email: "john@example.com",
      })
    );
    expect(result.success).toBe(true);
    expect(result.data.token).toBe("jwt.token.here");
  });

  it("6. authService.login: dispatches login payload and returns tokens", async () => {
    const postSpy = vi.spyOn(axiosInstance, "post").mockResolvedValueOnce({
      data: {
        success: true,
        message: "Login successful",
        data: {
          token: "jwt.token.here",
          email: "john@example.com",
          role: "USER",
        },
      },
    });

    const result = await authService.login({
      email: "john@example.com",
      password: "password123",
    });

    expect(postSpy).toHaveBeenCalledWith("/api/auth/login", {
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });
});
