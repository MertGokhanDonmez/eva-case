
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import {AuthService} from '@/services/AuthService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      if (AuthService.isAuthenticated()) {
        // Kullanıcı kimlik doğrulaması yapmışsa sayfaya izin ver
        next();
      } else {
        // Kimlik doğrulaması yapılmamışsa login sayfasına yönlendir
        next('/');
      }
    },
  },
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
