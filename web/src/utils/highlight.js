/* 自定义代码高亮插件 */

import hljs from 'highlight.js';
import Clipboard from 'clipboard';
import 'highlight.js/styles/agate.css';
import SvgIcon from '../components/SvgIcon/SvgIcon.vue';
import Vue from 'vue';
import store from '../store/index';

//使用基础 Vue 构造器,创建一个具有初始化选项的Vue子类。
const Profile = Vue.extend(SvgIcon);
// 2.new的方式 根据组件构造器，可以创建出来一个组件对象，$mount()将组件对象 手动挂载到某一个元素上
const svgicon = new Profile().$mount(document.createElement('div'));
svgicon.iconClass = 'copy';
svgicon.className = 'copy-icon';
// 3.svgicon.$el对应的就是div
const doc = svgicon.$el;
// 定义全局变量clipboard
let clipboard = null;

const highlight = Vue.directive('highlight', {
    update: function(el) {
        let blocks = el.querySelectorAll('pre code');
        if (store.state.key == 0) {
            blocks.forEach(block => {
                hljs.highlightBlock(block);
                // 添加ul增加行号
                block.innerHTML = '<ul><li>' + block.innerHTML.replace(/\n/g, '\n</li><li>') + '\n</li></ul>';
                block.querySelector('li:last-child').remove();
                block.parentElement.innerHTML += '<button class="btn ripple" data-clipboard-target=""></button>';
            });
            el.querySelectorAll('.btn').forEach(btn => {
                //doc.cloneNode(doc)解决循环appendChild()方法只添加到最后一个btn的节点
                btn.appendChild(doc.cloneNode(doc));
                // 删除最后一个li
                btn.addEventListener('click', function() {
                    // 如果存在clipboard销毁
                    /*  if (clipboard) {
                    } */
                    clipboard = new Clipboard('.btn', {
                        // 通过target指定要复印的节点
                        target: function() {
                            console.log(btn.previousElementSibling);
                            return btn.previousElementSibling;
                        }
                    });
                    clipboard.on('success', function(e) {
                        if (store.state.mobile) {
                            Vue.prototype.$Toast.success({
                                message: '复制成功',
                                duration: 1000
                            });
                        } else {
                            Vue.prototype.$message({
                                type: 'success',
                                message: '复制成功'
                            });
                        }
                        clipboard.destroy();
                    });
                });
            });
        }
    }
});

export default highlight;
