import emotions from './emotion';
import store from '../store/index';

export default {
    randSolt: function (arr, len) {
        for (const index in arr) {
            const rand = parseInt(Math.random() * arr.length);
            const temp = arr[rand];
            arr[rand] = arr[index];
            arr[index] = temp;
        }
        const cloneArr = arr.slice(0, len);
        return cloneArr;
    },
    Emoji: function (str) {
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
    IsDel: function (res, _this) {
        res.forEach(element => {
            // 增加是否展开属性
            element.isDrop = true;
            _this.$store.state.slideList.forEach((item) => {
                if (item._id === element._id) {
                    element.isDrop = false
                }
            });
            // element.showPopover = false;
            element.isDel = _this.user && _this.user._id === element.user._id;
            element.children.forEach(item => {
                // element.showPopover = false;
                item.isDel = _this.user && _this.user._id === item.user._id;
            });
        });
    },
    getTop: function (element) {
        /* let realTop = element.offsetTop;
        let parent = element.offsetParent;
        while (parent !== null) {
            realTop += parent.offsetTop;
            parent = parent.offsetParent;
        } */
        return element.getBoundingClientRect().top + 186;
    },
    isElemVisible: function (el) {
        let rect = el.getBoundingClientRect();
        let rectTop = rect.top;
        let rectBottom = rect.bottom;
        return rectTop < window.innerHeight && rectBottom >= 0;
    },
    initializeFlag: function () {
        if (store.state.flag === true) {
            store.commit('handleFlag', false);
        }
    },
    rotate: function(img , angle) {
        this.InterVal = setInterval((_) => {
            this.rotateVal += angle;
            // 设置旋转属性(顺时针)
            img.style.transform = "rotate(" + this.rotateVal + "deg)";
            // 设置旋转属性(逆时针)
            //img.style.transform = 'rotate(-' + rotateVal + 'deg)'
            // 设置旋转时的动画  匀速0.1s
            img.style.transition = "0.1s linear";
        }, 100);
    },
    time_minute: function(time) {
        let minute = parseInt(time/60);
        let second = parseInt(time%60);
        let str_minute = minute < 10 ? ("0"+minute) : minute;
        let str_second = second < 10 ? ("0"+second) : second;
        return str_minute + ":" + str_second;
    }
};