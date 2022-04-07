// 更改用户状态信息
import { playStatus } from './getters';

export const userStatus = (state, user) => {
    if (user) {
        state.currentUser = user;
        state.isLogin = true;
    } else if (user == null) {
        // 登出清空sessionStorage
        // sessionStorage.setItem('userName', null);
        localStorage.setItem('token', '');
        state.currentUser = null;
        state.isLogin = false;
    }
};
export const dialogStatus = (state, v) => {
    state.isDialog = v;
};
export const handleLoding = (state, value) => {
    state.isLoding = value;
};
export const handleFlag = (state, value) => {
    state.flag = value;
};
export const handleType = (state, value) => {
    state.type = value;
};
export const handleArticle = (state, value) => {
    state.articles = value;
};
export const handleDevice = (state, value) => {
    state.device = value;
};
export const handleMobile = (state, value) => {
    state.mobile = value;
};
export const handleTitle = (state, value) => {
    state.articleTitle = value;
};
export const HandleSlideList = (state, value) => {
    const flag = state.slideList.includes(value);
    if (!flag) {
        state.slideList.push(value);
    }
};
export const RemoveSlideList = (state, value) => {
    if(value) {
        const flag = state.slideList.indexOf(value);
        if (flag !== -1) {
            state.slideList.splice(flag, 1);
        }
    } else {
        state.slideList = [];
    }

};
export const handleTheme = (state, value) => {
    state.theme = value;
};
//
export const handleResetUserId = (state, value) => {
    state.resetUserId = value;
};
export const handleCurrentMusic = (state, value) => {
    state.currentMusic = value;
};
export const handlePlayStatus = (state, value) => {
    state.playStatus = value;
};
export const PushCurrentMusic = (state,[key, value]) => {
    state.currentMusic[key] = value;
};
export const handleAudioReady = (state, value) => {
    state.isAudioReady = value;
};

