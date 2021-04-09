import Vue from 'vue';
import axios from 'axios';
import store from '../store/index';

//导入进度条插件
import Nprogress from 'nprogress';
import 'nprogress/nprogress';

function request() {
    const instance1 = axios.create({
        baseURL: '/api1'
    });
    const instance2 = axios.create({
        baseURL: '/api2'
    });
    let flag = true;
    /// 设置请求拦截器和响应拦截器
    // request headers传入token
    instance2.interceptors.request.use(
        config => {
            if (localStorage.token) {
                config.headers.Authorization = 'Bearer ' + localStorage.token;
            }
            if (store.state.isLoding == false && store.state.flag == false) {
                store.commit('handleLoding', true);
                store.commit('handleFlag', true);
            } 
            // 展示进度条
            Nprogress.start();
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
    // 在响应拦截器中隐藏进度条
    instance2.interceptors.response.use(
        response => {
            // 隐藏进度条
            // console.log(response);
            Nprogress.done();
            if (store.state.isLoding == true) {
                store.commit('handleLoding', false);
            }
            // 在最后必须return response
            return response;
        },
        error => {
            if (error.response.config.url !== 'login') {
                store.commit('handleLoding', true);
            }
            return Promise.reject(error);
        }
    );
    return [instance1, instance2];
}
export default request();
// 将导入的 axios，挂载到Vue的原型对象上，这样所有 vue 的实例都可以使用
