import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import weather from 'vue3-mini-weather'

const app = createApp(App)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const baseView = () => import("@/layout/base-view.vue");
const photos = () => import("@/page/Photo.vue")
const music = () => import("@/page/Music.vue")
const clock = () => import("@/page/Clock.vue")
const pics = () => import("@/page/Pics.vue")
const playMusic = () => import("@/page/PlayMusic.vue")
const routes = [
    {
        path: '',
        component: baseView,
        redirect: '/clock',
        children: [
            {
                path: "/pics",
                icon: 'el-icon-s-home',
                hidden: false,
                component: pics
            },
            {
                path: "/playMusic/:id",
                icon: 'el-icon-s-home',
                hidden: false,
                component: playMusic
            },
            {
                path: '/music',
                icon: 'el-icon-cpu',
                hidden: false,
                component: music
            },
            {
                path: '/photo',
                icon: 'el-icon-cpu',
                hidden: false,
                component: photos
            },
            {
                path: '/clock',
                icon: 'el-icon-cpu',
                hidden: false,
                component: clock
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

app.use(ElementPlus).use(router).use(weather)
app.mount('#app')