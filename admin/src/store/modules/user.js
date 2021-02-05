import Vue from 'vue';
const state = {
    name: '',
    avatar: ''
};

const mutations = {
    SET_LOGIN: (state, data) => {
        Vue.set(state, 'name', data.username);
        Vue.set(state, 'avatar', data.avatar);
        // state.name = data.username;
        // state.avatar = data.avatar;
    },
   
    USER_SIGNOUT: state => {
      Object.keys(state).forEach(key => {
        Vue.set(state, [key], null);
      });
    }
};

const actions = {
    saveUserInfo({ commit }, data) {
        console.log(data);
        commit('SET_LOGIN', data);
    },
    clearLogin({ commit }) {
        commit('USER_SIGNOUT');
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
