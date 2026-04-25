import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL 

export const $axios = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: false,
});