import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_URL, $axios } from "./axios";
import { useAuthStore } from "../../entities/auth/model/auth.store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = {
  access: string;
  refresh?: string;
};

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

$api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    const isRefreshRequest =
      originalRequest.url?.includes("/employes/token/refresh/");
    const isLoginRequest =
      originalRequest.url?.includes("/employes/login/");
    const isLogoutRequest =
      originalRequest.url?.includes("/employes/logout/");

    if (
      status === 401 &&
      !originalRequest._retry &&
      refreshToken &&
      !isRefreshRequest &&
      !isLoginRequest &&
      !isLogoutRequest
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await $axios.post<RefreshResponse>(
          "employes/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccess = data.access;
        const newRefresh = data.refresh ?? refreshToken;

        setTokens({
          access: newAccess,
          refresh: newRefresh,
        });

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return $api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default $api;