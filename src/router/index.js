import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../views/AuthenticationPage.vue";
import About from "../views/About.vue";
const routes = [
  {
    path: "/",
    name: "About",
    component: About,
  },
  {
    path: "/auth",
    name: Authentication,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
