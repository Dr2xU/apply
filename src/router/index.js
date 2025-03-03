import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Auth from '@/views/auth/Index.vue'
import Dashboard from '@/views/dashboard/Index.vue'
import ErrorPage from '@/views/error/Index.vue'

const routes = [
  { path: '/auth', name: 'Auth', component: Auth, meta: { guest: true } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/', redirect: '/auth' },
  { path: '/:pathMatch(.*)*', name: 'ErrorPage', component: ErrorPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Route Guard for Authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.warn('🔒 Protected route! Redirecting to login...')
    return next('/auth')
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    console.info('🚀 Already logged in! Redirecting to dashboard...')
    return next('/dashboard')
  }

  next()
})

export default router
