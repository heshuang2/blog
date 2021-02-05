import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import 'default-passive-events' //Chrome 增加了新的事件捕获机制－Passive Event Listeners；

import '@/styles/index.scss' // global css

import App from './App'
import axios from 'axios'
import service from './utils/request'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/utils/permission' // permission control


import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'mavon-editor/dist/markdown/github-markdown.min.css'
import 'highlight.js/styles/atom-one-dark.css'; // 样式文件 
// use
Vue.use(mavonEditor)


import filters from "./utils/filter";
filters(Vue); //使用filter

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
Vue.prototype.$http = service

function getServerConfig() {
  return new Promise((resolve, reject) => {
    axios.get('./serverConfig.json').then((result) => {
      // console.log(result) // 看打印出来的结果
      const config = result.data
      for (const key in config) {
        Vue.prototype[key] = config[key]
      }
      // 验证是否已经把属性挂在了Vue上
      // console.log(Vue.prototype.BASE_ADDR)
      resolve()
    }).catch((error) => {
      console.log(error)
      reject()
    })
  })
}

Vue.mixin({
  methods: {
    getAuthHeaders() {
      return {
          Authorization: `Bearer ${localStorage.token || ''}`
      };
    }
  }
})

async function init() {
  await getServerConfig()
  axios.defaults.baseURL = Vue.prototype.BASE_API
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

init()
