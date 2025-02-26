import { createRouter, createWebHistory } from 'vue-router';
import Auth from '@/views/auth/Index.vue';
import Dashboard from '@/views/dashboard/Index.vue';
import ErrorPage from '@/views/error/Index.vue'; // ✅ Import Error Page

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  { path: '/', redirect: '/auth' }, // Default redirect to login page

  // ✅ Catch-all route for invalid links
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorPage',
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard for Protected Routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
});

export default router;
