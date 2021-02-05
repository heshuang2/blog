// 更改用户状态信息
export const userStatus = (state, user) => {
    if (user) {
        state.currentUser = user;
        state.isLogin = true;
    }else if (user == null) {   
        // 登出清空sessionStorage
        // sessionStorage.setItem('userName', null);
        localStorage.setItem('token', '');
        state.currentUser = null;
        state.isLogin = false;
    }
}
export const dialogStatus = (state, v) => {
    state.isDialog = v
};