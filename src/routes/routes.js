import { createRouter, createWebHashHistory } from "vue-router";
import juego from "../components/juego.vue";

const routes = [
  { path: "/juego", component: juego }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
