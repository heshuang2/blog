import Vue from 'vue';
const state = {
    role_name: '',
    role_routers: []
};

const mutations = {
    GENERATE_NAME: (state, data) => {
        Vue.set(state, 'role_name', data.role);
        // state.name = data.username;
        // state.avatar = data.avatar;
    },

    GENERATE_ROUTERS: (state, data)=> {
        console.log(data);
    }
};

const actions = {
    generateName({ commit }, data) {
        console.log(data);
        commit('GENERATE_NAME', data);
    },
    generateRouters({ commit }, data) {
        commit('GENERATE_ROUTERS', data);
    }
};

export default {
    // namespaced: true,
    state,
    mutations,
    actions
};
