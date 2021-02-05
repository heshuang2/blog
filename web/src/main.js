// 导入全局初始化样式
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/index.scss';
import request from './network/request'
import store from './store';

Vue.prototype.$http1 = request[0];
Vue.prototype.$http2 = request[1];

console.log(Vue.prototype);

import captcha from 'vue-social-captcha';
Vue.use(captcha);

import VueParticles from 'vue-particles';
Vue.use(VueParticles);  

import APlayer from '@moefe/vue-aplayer';

Vue.use(APlayer, {
    // defaultCover: 'https://github.com/u3u.png',
    productionTip: false
});
import './assets/icons';

Vue.config.productionTip = false;

// Vue.prototype.mywindow = window;
import filters from "./utils/filter";
filters(Vue); //使用filter
import utils from './utils/util'
Vue.prototype.utils = utils;
// 事件总线
Vue.prototype.$bus = new Vue();

let vue = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

export default vue;
