import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import role from './modules/role'

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        settings,
        user,
        role
    },
    getters,
    plugins: [createPersistedState({
        storage: window.localStorage,
        reducer(val) {
            return {
                // 只储存state中的assessmentData
                user: val.user,
            };
        }
    })]
});

export default store
