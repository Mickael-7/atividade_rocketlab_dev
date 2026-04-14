import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "ecm_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function useAuth() {
  const navigate = useNavigate();

  const isAuthenticated = !!getToken();

  const logout = useCallback(() => {
    clearToken();
    navigate("/login", { replace: true });
  }, [navigate]);

  return { isAuthenticated, logout };
}
