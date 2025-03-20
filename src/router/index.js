/**
 * Vue Router Configuration
 *
 * Defines routes and authentication guards for the application.
 * Redirects users based on authentication state.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load components
const Auth = () => import('@/views/auth/Index.vue')
const Dashboard = () => import('@/views/dashboard/Index.vue')
const ErrorPage = () => import('@/views/error/Index.vue')

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  { path: '/', redirect: '/auth' },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorPage',
    component: ErrorPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Route Guard: Ensures authentication rules are enforced.
 * Redirects unauthenticated users away from protected routes.
 * Redirects logged-in users away from guest-only routes.
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')

  // Redirect unauthenticated users from protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.warn('🔒 Access denied: Redirecting to login.')
    return next('/auth')
  }

  // Redirect authenticated users away from guest-only routes
  if (to.meta.guest && authStore.isAuthenticated) {
    console.info('🚀 User already logged in: Redirecting to dashboard.')
    return next('/dashboard')
  }

  next()
})

export default router
