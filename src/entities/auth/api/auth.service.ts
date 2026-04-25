import { $axios } from "../../../shared/api/axios";
import $api from "../../../shared/api/api";
import type { LoginRequest, LoginResponse, ProfileInfo } from "../types/auth.types";

export const AuthService = {
  async login(payload: LoginRequest) {
    const { data } = await $axios.post<LoginResponse>("employes/login/", payload);
    return data;
  },

  async getProfile() {
    const { data } = await $api.get<ProfileInfo>("employes/profile/");
    return data;
  },

  async logout(refresh: string) {
    const { data } = await $api.post("employes/logout/", {
      refresh,
    });
    return data;
  },
};