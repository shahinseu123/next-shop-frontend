import { tokenService } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOptions = RequestInit & {
  params?: Record<string, string | number>;
};

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with optional query params
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.append(k, String(v))
    );
  }

  const token = tokenService.getToken();

  const res = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...fetchOptions.headers,
    },
  });

  // Session expired — clear token and redirect to login
  if (res.status === 401) {
    tokenService.clearToken();
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Something went wrong");
  }

  // Handle empty responses (e.g. DELETE)
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}