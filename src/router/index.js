import { createRouter, createWebHistory } from "vue-router";
import Authentication from "../views/AuthenticationPage.vue";
import About from "../views/About.vue";
import Project from "../views/Project.vue";
import ProjProfile from "../components/ProjProfile.vue";
import SignUpQuestionaire from "../components/SignUpQuestionaire.vue";
import Profile from "../components/Profile.vue";
import EditProfile from "../components/EditProfile.vue";
import ManagePrj from "../components/ManagePrj.vue";
import Cppp from "../components/Cppp.vue";
import EditProjectProfile from "../components/EditProjectProfile.vue";

const routes = [
  {
    path: "/",
    name: "About",
    component: About,
  },
  {
    path: "/project",
    name: "Project",
    component: Project,
  },
  {
    path: "/project/:id",
    name: "ProjProfile",
    component: ProjProfile,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Authentication,
  },
  {
    path: "/SignUpQuestionaire/:userId",
    name: "SignUpQuestionaire",
    component: SignUpQuestionaire,
    props: true,
  },
  {
    path: "/Profile/:userId",
    name: "Profile",
    component: Profile,
    props: true,
  },
  {
    path: "/ManagePrj/:id",
    name: "ManagePrj",
    component: ManagePrj,
  },

  {
    path: "/Edit-Profile/:userId",
    name: "EditProfile",
    component: EditProfile,
    props: true,
  },
  {
    path: "/Cppp",
    name: "Cppp",
    component: Cppp,
  },
  {
    path: "/editProjectProfile/:id",
    name: "EditProjectProfile",
    component: EditProjectProfile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
