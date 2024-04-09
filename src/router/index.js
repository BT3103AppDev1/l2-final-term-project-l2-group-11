import { createRouter, createWebHistory } from 'vue-router'
import Authentication from '../views/AuthenticationPage.vue'
import About from '../views/About.vue'
import Project from '../views/Project.vue'
import ProjProfile from '../components/ProjProfile.vue'
import SignUpQuestionaire from '../views/SignUpQuestionaire.vue'
import Profile from '../components/Profile.vue'
import Reviews from "../views/ReviewsPage.vue"

const routes = [
    {
        path: '/',
        name: 'About',
        component: About
    },
    {
        path: '/project',
        name: 'Project',
        component: Project
    },
    {
        path: '/project/:id/:varibale',
        name: 'ProjProfile',
        component: ProjProfile
    },
    {
        path: '/auth/:state',
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
    },
    {
        path:'/reviews',
        name: 'Reviews',
        component: Reviews
    }
]

const router = createRouter({
 history: createWebHistory(),
 routes
})

export default router