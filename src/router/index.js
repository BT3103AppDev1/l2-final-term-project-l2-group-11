import { createRouter, createWebHistory } from 'vue-router'
import Authentication from '../views/AuthenticationPage.vue'
import About from '../views/About.vue'
import Home from '../views/Home.vue'
import SignUpQuestionaire from '@/components/SignUpQuestionaire.vue'
import Profile from '@/components/Profile.vue'

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
    },

    {
        path: '/SignUpQuestionaire/:userId',
        name: 'SignUpQuestionaire',
        component: SignUpQuestionaire,
        props: true
    },

    {
        path:'/Profile/:userId',
        name: 'Profile',
        component: Profile,
        props:true 
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