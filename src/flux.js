import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        authorized: false,
        session_id: -1,
        jwt: '',
        redirect_url: '',
    },
    mutations: {
        SET_USER (state, user) {
            state.user = user;
        },
        SET_JWT (state, user) {
            state.user = user;
        }
    },
    actions: {
    },
    getters: {
    }
})

export default store
