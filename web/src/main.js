// 导入全局初始化样式
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './plugins/vant.js';
import './assets/css/index.scss';
import './assets/css/cartoon.scss';
import './assets/css/meadia.scss';
import './assets/css/main_h5.scss';
import request from './network/request';
import store from './store';

import VueTouch from 'vue-touch';

Vue.use(VueTouch, { name: 'v-touch' }); // v-touch可以是自定义名称

// highlight.js代码高亮插件
import Highlight from './utils/highlight';
Vue.use(Highlight);

Vue.prototype.$http1 = request[0];
Vue.prototype.$http2 = request[1];

import qs from 'qs';
Vue.prototype.$qs = qs;

import 'default-passive-events';

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
import filters from './utils/filter';
filters(Vue); //使用filter
import utils from './utils/util';
Vue.prototype.utils = utils;
// 事件总线
Vue.prototype.$bus = new Vue();

let vue = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

export default vue;
