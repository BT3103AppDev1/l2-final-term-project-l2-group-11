import { createRouter, createWebHistory } from 'vue-router'
import Authentication from '../views/AuthenticationPage.vue'
import About from '../views/About.vue'
import Project from '../views/Project.vue'
import ProjectProfile from '../views/ProjectProfile.vue'
import SignUpQuestionaire from '../views/SignUpQuestionaire.vue'
import Profile from '../views/Profile.vue'
import EditProfile from '../views/EditProfile.vue'
import ManagePrj from '../components/ManagePrj.vue'
import ReviewsPage from "../views/ReviewsPage.vue"
import CreateProject from "../components/Cppp.vue"
import RegisterForm from "../components/RegisterForm.vue"


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
        component: ProjectProfile,
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
        path: '/auth',
        redirect: '/auth/login' 
    },
    {
        path:'/Profile/:userId/:projectId?',
        name: 'Profile',
        component: Profile,
        props:true 
    }, 
    {
        path:'/ManagePrj/:id',
        name: 'ManagePrj',
        component: ManagePrj,
    
    },
    {
        path: '/Edit-Profile/:userId',
        name: 'EditProfile',
        component: EditProfile,
        props: true
    },
    {
        path: '/ReviewsPage/:userId',
        name: 'ReviewsPage',
        component: ReviewsPage,
    },
    {
        path: '/CreateProject',
        name: 'CreateProject',
        component: CreateProject
    }
]

const router = createRouter({
 history: createWebHistory(),
 routes
})


export default router
