import emotions from './emotion';
import store from '../store/index';
export default {
    randSolt: function(arr, len) {
        for (const index in arr) {
            const rand = parseInt(Math.random() * arr.length);
            const temp = arr[rand];
            arr[rand] = arr[index];
            arr[index] = temp;
        }
        const cloneArr = arr.slice(0, len);
        return cloneArr;
    },
    Emoji: function(str) {
        return str.replace(/\[#[\u4E00-\u9FA5]{1,5}]/g, words => {
            let word = words.replace(/#|\[|\]/g, '');
            let index = emotions.emotionList.indexOf(word);
            if (index !== -1) {
                return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="center">`;
            } else {
                return words;
            }
        });
    },
    IsDel: function(res, _this) {
        res.forEach(element => {
            // 增加是否展开属性
            element.isDrop = true;
            // element.showPopover = false;
            if (_this.user && _this.user._id === element.user._id) {
                element.isDel = true;
            } else {
                element.isDel = false;
            }
            element.children.forEach(item => {
                // element.showPopover = false;
                if (_this.user && _this.user._id === item.user._id) {
                    item.isDel = true;
                } else {
                    item.isDel = false;
                }
            });
        });
    },
    getTop: function(element) {
        let realTop = element.offsetTop;
        let parent = element.offsetParent;
        while (parent !== null) {
            realTop += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return realTop;
    },
    isElemVisible: function(el) {
        let rect = el.getBoundingClientRect();
        let rectTop = rect.top;
        let rectBottom = rect.bottom;
        return rectTop < window.innerHeight && rectBottom >= 0;
    },
    initializeFlag: function() {
        if (store.state.flag == true) {
            store.commit('handleFlag', false);
        }
    }
};
