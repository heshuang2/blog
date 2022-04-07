import store from '../store/index'
/* * 正则库
 */
const pattern = {
    account: /^[a-zA-Z0-9_-]+$/, //用户名正则，4到16位（字母，数字，下划线，减号）
    password: /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\\(\\)])+$)([^(0-9a-zA-Z)]|[\\(\\)]|[a-zA-Z]|[0-9]){6,}$/, // 密码校验
    email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, //邮箱校验
    name: /^[\u4e00-\u9fa5A-Za-z0-9-_]*$/,
    email_code: /^[0-9]*$/
};
/*  * 内置规则
 * @param {String} reg - {pattern}中预定义正则名称 or 自定义正则
 * @param {String} msg1 - 正则校验不通过提示
 * @param {String} msg2 - 值为空时提示（可不填）
 */

export function validates(reg, msg1, msg2, _this) {
    return async (rule, value, callback) => {
        if (!value) {
            if (!msg2) {
                callback();
            }
            callback(new Error(msg2));
        }
        const regName = reg;
        const regular = pattern[reg] ? pattern[reg] : reg;
        if (regular.test(value)) {
            if (_this) {
                const { data: res } = await _this.$http2.post('account', {regName, value });
                if (res.err ) {
                    callback(new Error(res.msg));
                } else {
                    callback();
                }
            }else {
                callback();
            }
        } else {
            callback(new Error(msg1));
        }
    };
}
export function obtainError(reg, msg1, msg2, _this) {
    return async (rule, value, callback) => {
        if (!value) {
            if (!msg2) {
                callback();
            }
            callback(new Error(msg2));
        }
        // const regName = reg;
        const regular = pattern[reg] ? pattern[reg] : reg;
        console.log(regular.test(value));
        if (regular.test(value)) {
            if (_this) {
                const { data: res } = await _this.$http2.post('email', {value });
                if (res.err ) {
                    callback(new Error(res.msg));
                } else {
                    store.commit('handleResetUserId', res.data)
                    callback();
                }
            }else {
                callback();
            }
        } else {
            callback(new Error(msg1));
        }
    };
}
/* export function accountOnly(_this) {
    return async (rule, value, callback) => {
        const { data: res } = await _this.$http2.post('account', { value });
        console.log(res);
        if (res.err) {
            console.log(callback);
            callback(new Error('123'));
        } else {
            callback();
        }
    };
} */

// export default validates;
