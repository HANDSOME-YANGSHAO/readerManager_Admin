import { RouteRecordRaw } from 'vue-router'

const Login = (): unknown => import('../views/login/index.vue')
const Layout = (): unknown => import('../components/layout/index.vue')
const UserManage = (): unknown => import('../views/userManage/index.vue')
const ClassManage = (): unknown => import('../views/classManage/index.vue')
const AdminManage = (): unknown => import('../views/adminManage/index.vue')
const BookShelf = (): unknown => import('../views/bookShelf/index.vue')
const ChapterManage = (): unknown => import('../views/chapterManage/index.vue')

export const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: Layout
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'InfoManage',
    path: '/infoManage',
    component: Layout,
    children: [
      {
        path: 'userManage',
        component: UserManage
      },
      {
        path: 'classManage',
        component: ClassManage
      },
      {
        path: 'adminManage',
        component: AdminManage
      }
    ]
  },
  {
    name: 'BookManage',
    path: '/bookManage',
    component: Layout,
    children: [
      {
        path: 'bookShelf',
        component: BookShelf
      },
      {
        path: 'chapterManage',
        component: ChapterManage
      }
    ]
  }
]
