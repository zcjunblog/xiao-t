import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect:'/home'},
    { path: '/home', name: '首页', component: () => import("@renderer/views/index/index.vue")  },
    { path: '/:pathMatch(.*)*', component: () => import("@renderer/views/404.vue") },
    { path: '/land', name: '总览', component: () => import('@renderer/components/LandingPage.vue') },
]

export default routes
