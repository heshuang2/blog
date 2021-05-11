import axios from 'axios';
import router from '../router';
import { MessageBox, Message } from 'element-ui';

// create an axios instance
const service = axios.create({
    baseURL: 'http://localhost:3000/admin/api', // url = base url + request url
    timeout: 5000 // request timeout
});

// request headers传入token
service.interceptors.request.use(
    config => {
        if (localStorage.token) {
            config.headers.Authorization = 'Bearer ' + localStorage.token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 拦截器
service.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.log(error.response.data);
        if (error.response.data.message) {
            Message({
                type: 'error',
                message: error.response.data.message
            });
            localStorage.clear();
            if (error.response.status !== 200) {
                router.push('/login');
            };
            
        }
        return Promise.reject(error);
    }
);

export default service;
