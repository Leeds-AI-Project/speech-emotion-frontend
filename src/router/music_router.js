import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue'; // 假设你有一个首页组件
import UpLoader from '@/components/UpLoader.vue';
import VoiceRecorder from '@/components/VoiceRecorder.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/upload',
        name: 'UpLoader',
        component: UpLoader,
    },
    {
        path: '/record',
        name: 'VoiceRecorder',
        component: VoiceRecorder,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
