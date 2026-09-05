import { createRouter, createWebHistory } from 'vue-router'

import { applyAuthGuard } from '@/router/guards'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    permission?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register/student',
      name: 'register-student',
      component: () => import('@/pages/auth/RegisterStudentPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register/instructor',
      name: 'register-instructor',
      component: () => import('@/pages/auth/RegisterInstructorPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/pages/categories/CategoriesListPage.vue'),
      meta: { requiresAuth: true, permission: 'categories.view' },
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('@/pages/students/StudentsListPage.vue'),
      meta: { requiresAuth: true, permission: 'students.view' },
    },
    {
      path: '/instructors',
      name: 'instructors',
      component: () => import('@/pages/instructors/InstructorsListPage.vue'),
      meta: { requiresAuth: true, permission: 'instructors.view' },
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('@/pages/courses/CoursesListPage.vue'),
      meta: { requiresAuth: true, permission: 'courses.view' },
    },
    {
      path: '/enrollments',
      name: 'enrollments',
      component: () => import('@/pages/enrollments/EnrollmentsListPage.vue'),
      meta: { requiresAuth: true, permission: 'enrollments.view' },
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/pages/errors/ForbiddenPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/errors/NotFoundPage.vue'),
    },
  ],
})

applyAuthGuard(router)

export default router
