import { createRouter, createWebHistory } from 'vue-router'
import Authentication from '../views/AuthenticationPage.vue'
import About from '../views/About.vue'
import Project from '../views/Project.vue'
import ProjProfile from '../components/ProjProfile.vue'
import SignUpQuestionaire from '../components/SignUpQuestionaire.vue'
import Profile from '../components/Profile.vue'
import EditProfile from '../components/EditProfile.vue';


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
        path: '/project/:id',
        name: 'ProjProfile',
        component: ProjProfile
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
    },

    {
        path:'/reviews',
        name: 'Reviews',
        component: Reviews
    },

    {
        path: '/Edit-Profile/:userId',
        name: 'EditProfile',
        component: EditProfile,
        props: true
    }
]

const router = createRouter({
 history: createWebHistory(),
 routes
})

export default router