// router.js
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import Login from "@/views/LoginPage.vue";
import Task from "@/views/TaskPage.vue";
import { decryptToken } from "@/utils/encryptHelper"

const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Task,
    meta: { requiresAuth: true },
  },
  // { path: '/:pathMatch(.*)*', redirect: '/login' }, // wildcard redirect
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user) {
    next("/login");
  } else {
    const authLogin = store.state?.user;
    if (authLogin) {
      const { token } = decryptToken(authLogin.token);
      if (token !== process.env.VUE_APP_MOCK_TOKEN_LOGIN) {
        localStorage.removeItem("token");
        store.commit('setUser', null);
        next("/login");
      }
    }
    next();
  }
});

export default router;
