import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home.vue"
import Classroom from "@/views/Classroom.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/classroom", component: Classroom },
]

const router = createRouter({
  routes,
  history: createWebHashHistory()
})


export default router