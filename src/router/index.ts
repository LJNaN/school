import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home.vue"
// import Classroom from "@/views/Classroom.vue"



const routes = [
  { path: "/", component: Home },
  // { path: "/classroom", component: Classroom },
  { path: "/SmartSchool", component: () => import("../views/SmartSchool.vue") },
  { path: "/SmartEducationInner", component: () => import("../views/SmartEducationInner.vue") },
  { path: "/SmartEducationOuter", component: () => import("../views/SmartEducationOuter.vue") },
  { path: "/SmartEnergy", component: () => import("../views/SmartEnergy.vue") },
  { path: "/SmartSecurity", component: () => import("../views/SmartSecurity.vue") },
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})


export default router