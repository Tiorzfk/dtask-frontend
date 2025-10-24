import axios from "axios";
import store from "../store";

const API_HOST = process.env.VUE_APP_API_HOST || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_HOST}/api`,
});

// Interceptor request: show loading
api.interceptors.request.use(
  (config) => {
    store.commit("setLoading", true);
    const auth = JSON.parse(localStorage.getItem("token")) || {};
    const { token = '' } = auth;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    store.commit("setLoading", false);
    return Promise.reject(error);
  }
);

// Interceptor response: hide loading
api.interceptors.response.use(
  (response) => {
    store.commit("setLoading", false);
    return response;
  },
  (error) => {
    store.commit("setLoading", false);
    return Promise.reject(error);
  }
);

export default api;
