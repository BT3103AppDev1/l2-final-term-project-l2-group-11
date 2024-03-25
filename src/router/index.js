import { createRouter, createWebHistory } from 'vue-router'
import Authentication from '../views/AuthenticationPage.vue'
import About from '../views/About.vue'
import Home from '../views/Home.vue'
const routes = [
    {
        path: '/',
        name: 'About',
        component: About
    },
    {
        path: '/project',
        name: 'Project',
        component: Home
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Authentication,
    }
]

const router = createRouter({
 history: createWebHistory(),
 routes
})

router.beforeEach(async (to, from) => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && to.name === "Auth") {
        return { name: 'About' }
    }
})

export default router