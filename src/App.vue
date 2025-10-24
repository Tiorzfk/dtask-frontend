<template>
  <div>
    <nav class="bg-blue-500 text-white px-6 py-2 flex justify-between items-center">
      <h1 class="text-sm font-bold">
        MyAppTest - Daily Task App
      </h1>
      <div v-if="user">
        <span class="mr-4">Hello, {{ user.user.username }}</span>
        <button
          class="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-100"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </nav>

    <LoadingSpinner v-if="loading" />

    <main class="p-8">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import LoadingSpinner from "./components/LoadingSpinner.vue";

export default {
  components: { LoadingSpinner },
  computed: {
    ...mapState(["user", "loading"]),
  },
  methods: {
    ...mapMutations(["setUser"]),
    logout() {
      localStorage.removeItem("token");
      this.setUser(null);
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Tambahan styling jika perlu */
</style>
