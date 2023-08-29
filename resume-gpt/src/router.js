import { createRouter, createWebHistory } from 'vue-router'

// Lazy-load views
const HomePage = () => import('@/views/HomePage.vue')

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  }
  // Add other routes as needed
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router