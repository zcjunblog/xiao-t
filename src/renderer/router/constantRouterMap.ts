import { RouteRecordRaw } from 'vue-router'
import index from '@renderer/views/layout/index.vue'
const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect:'/index'},
    { path: '/index', name: '首页', component:index },
    { path: '/login', name: '确认身份', component: () => import('@renderer/views/login.vue') },
    { path: '/:pathMatch(.*)*', component: () => import("@renderer/views/404.vue") },
    { path: '/land', name: '总览', component: () => import('@renderer/components/LandingPage.vue') },
    {
        path: '/index',
        component: index,
        children: [
            {
                name: 'Workbench',
                path: 'workbench',
                component: () => import('@renderer/views/index/index.vue'),
            },
            {
                name: 'Order',
                path: 'order',
                component: () => import('@renderer/views/order.vue'),
            }
        ]
    },
]

export default routes
