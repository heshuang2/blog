import Vue from 'vue'
// 在这里引入你所需的组件
import { Button, Overlay, ImagePreview, Popup, Popover, Dialog, Toast, Field } from 'vant';

// 按需引入UI组件
Vue.use(Button)
Vue.use(Overlay)
Vue.use(ImagePreview);
Vue.use(Popup);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(Field);

Vue.prototype.$ImagePreview = ImagePreview;
Vue.prototype.$Dialog = Dialog;
Vue.prototype.$Toast = Toast;