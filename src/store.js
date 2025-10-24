// src/store.js
import { createStore } from "vuex";
import api from "./api/axios"

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem("token")) || null,
    loading: false,
    tasks: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
  },
  actions: {
    async login(context, { username, password }) {
      try {
        const res = await api.post("/auth/login", { username, password });
        const { token, user } = res.data.data;
  
        // Simpan token dan user ke localStorage
        localStorage.setItem("token", JSON.stringify({ token, user }));
  
        context.commit("setUser", { token, user });
  
        return token;
      } catch (err) {
        console.error("Login failed:", err);
        throw err;
      }
    },

    async fetchTasks({ commit }) {
      try {
        const res = await api.get("/tasks");
        commit("setTasks", res.data);
      } catch (err) {
        console.error("Fetch tasks failed:", err);
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      commit("setUser", null);
      commit("setTasks", []);
    },
  },
});
