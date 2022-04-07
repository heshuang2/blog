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
        isDialog: false,
        // 处理代码高亮重复刷新
        key: 0,
        isLoding: false,
        flag: false,
        type: [],
        // 分类文章
        articles: [],
        device: null,
        mobile: false,
        articleTitle: '',
        slideList: [],
        theme: true,
        resetUserId:　'', //获取重置密码的账号id
        currentMusic: {}, //当前播放的音乐
        playStatus: 'pause', //播放状态
        isAudioReady: false, //判断audio是否可以播放
    },
    getters,
    mutations,
    actions,
    plugins: [
        createPersistedState({
            storage: window.localStorage,
            reducer(val) {
                return {
                    // 只储存state中的assessmentData
                    isLogin: val.isLogin,
                    currentUser: val.currentUser,
                    theme: val.theme
                };
            }
        })
    ]
});

export default store;
