import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        currentUser: null,
        isLogin: false,
        isDialog: false
    },
    getters,
    mutations,
    actions,
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
            reducer(val) {
                return {
                    // 只储存state中的assessmentData
                    isLogin: val.isLogin,
                    currentUser: val.currentUser
                };
            }
        })
    ]
});

export default store;
