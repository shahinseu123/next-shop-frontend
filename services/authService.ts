import { apiFetch } from "@/lib/api";
import { tokenService } from "@/lib/auth";
import { AuthTokens } from "@/type/api";

export const authService = {
  login: async (username: string, password: string) => {
    const data = await apiFetch<AuthTokens>("/authenticate", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    tokenService.setToken(data.accessToken);
    return data;
  },

  logout: () => {
    tokenService.clearToken();
    window.location.href = "/login";
  },
};