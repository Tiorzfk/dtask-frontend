<!-- src/views/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">
          Welcome Back
        </h1>
        <p class="text-gray-500 mt-2">
          Please login to your account
        </p>
      </div>

      <!-- Komponen error -->
      <ApiError
        :message="errorMessage"
        @clear="errorMessage = ''"
      />

      <form
        class="space-y-6"
        @submit.prevent="handleLogin"
      >
        <div>
          <label
            class="block text-gray-700 mb-2"
            for="username"
          >Username</label>
          <input
            id="username"
            v-model="username"
            placeholder="Enter your username"
            class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          >
        </div>

        <div>
          <label
            class="block text-gray-700 mb-2"
            for="password"
          >Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <div class="text-center mt-6 text-gray-400 text-sm">
        &copy; 2025 MileAppTest. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ApiError from "@/components/ApiError.vue";

const router = useRouter();
const store = useStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;
  
  try {
    await store.dispatch("login", {
      username: username.value,
      password: password.value,
    });

    router.push("/");
  } catch (err) {
    console.error("Login error:", err);
    // Tampilkan error message dari API atau default message
    errorMessage.value = err.response?.data?.message || "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input {
  transition: all 0.2s ease-in-out;
}
</style>
