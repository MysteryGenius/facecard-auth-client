import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login.vue'
import FacePass from './components/FacePass.vue'
import Confirm from './components/Confirm.vue'
import Landing from './components/Landing.vue'
import Register from './components/Register.vue'
import Users from './components/Users/CoreUser.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: '',
    routes: [
        {
            path: '/', 
            name: 'main',
            component: Login,
        },
        {
            path: '/face', 
            name: 'face',
            component: FacePass,
        },
        {
            path: '/confirm', 
            name: 'confirm',
            component: Confirm,
        },
        {
            path: '/register', 
            name: 'register',
            component: Register,
        },
        {
            path: '/users', 
            name: 'users',
            component: Users,
        },
        {
            path: '/landing/:url', 
            name: 'landing',
            component: Landing,
        },
    ]
})


export default router
