<template>
    <div id="dialog-card" ref="dialog" v-if="isDialog">
        <div class="v-card bg-white">
            <div class="back-btn">
                <button class="bg-white" @click="closeDialog">
                    <svg-icon icon-class="back" class="icon-item"></svg-icon>
                </button>
            </div>
            <div class="login-content">
                <div class="login-header">
                    <h2 class="header-top-fir">
                        欢迎{{ isLogin ? '回来' : '你' }}
                        <button class="register-btn bg-primary" type="button" @click="toggleBtn">
                            {{ isLogin ? '注册' : '登录' }}
                        </button>
                    </h2>
                    <h3 class="text-grey header-top-sec">请填写以下信息进行{{ isLogin ? '登录' : '注册' }}</h3>
                </div>
                <el-form
                    v-if="isLogin"
                    ref="loginForm"
                    class="login-main"
                    :model="loginModel"
                    :rules="loginRules"
                    key="1"
                >
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="loginModel.account" class="input-group"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="loginModel.password"
                            class="input-group"
                            :type="isPassword ? 'password' : 'text'"
                            @focus="errMessage = ''"
                        >
                            <span slot="suffix" v-show="errMessage != ''" class="err-tip">
                                <div>{{ errMessage }}</div>
                            </span>
                            <button
                                v-show="errMessage == ''"
                                slot="suffix"
                                class="iview-btn bg-light"
                                @click="isPassword = !isPassword"
                                type="button"
                            >
                                <svg-icon :icon-class="isPassword ? '不可见' : '可见'" class="icon-item"></svg-icon>
                            </button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="form-btn ripple" @click="submitForm('loginForm')">
                            <span>登录</span>
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-form
                    v-else
                    class="login-main"
                    ref="registerForm"
                    :model="registeModel"
                    :rules="varifyRules"
                    key="2"
                >
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="registeModel.account" class="input-group"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            v-model="registeModel.password"
                            class="input-group"
                            :type="isPassword ? 'password' : 'text'"
                        >
                            <button
                                slot="suffix"
                                class="iview-btn bg-light"
                                @click="isPassword = !isPassword"
                                type="button"
                            >
                                <svg-icon :icon-class="isPassword ? '不可见' : '可见'" class="icon-item"></svg-icon>
                            </button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="registeModel.email" class="input-group"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="name">
                        <el-input v-model="registeModel.name" class="input-group"></el-input>
                    </el-form-item>
                    <div class="captcha" @click="varify('registerForm')" :class="{ 'captcha-border': isVarify }">
                        <div class="captcha-overlay" :class="{ 'captcha-show': isVarify }"></div>
                        <div class="captcha-left">
                            <div class="captcha-left-icon">
                                <div v-if="isVarify" class="captcha-success">
                                    <svg-icon icon-class="success" class="icon-item"></svg-icon>
                                </div>
                                <div v-else class="captcha-circle bg-primary">
                                    <div class="captcha-circle-border"></div>
                                </div>
                            </div>
                            <div class="captcha-text" :class="{ 'Varify-text': isVarify }">
                                {{ isVarify ? '已通过验证' : '点击按钮进行验证' }}
                            </div>
                        </div>
                        <div class="captcha-right">
                            <svg-icon :icon-class="isVarify ? 'jiesuo' : 'suo'" class="icon-item"></svg-icon>
                        </div>
                    </div>
                    <button type="button" class="form-btn ripple" @click="setRegister('registerForm')">
                        <span>注册</span>
                    </button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { validates, } from '../../utils/validate';
import SvgIcon from '../SvgIcon/SvgIcon.vue';
export default {
    components: { SvgIcon },
    props: {
        isDialog: Boolean
    },
    data() {
        return {
            isLogin: true,
            isPassword: true,
            isVarify: false,
            loginModel: {},
            registeModel: {
                account: ''
            },
            loginRules: {
                account: [
                    {
                        required: true,
                        validator: validates('account', '用户名格式错误', '用户名不能为空！'),
                        trigger: 'blur'
                    },
                    { min: 6, max: 16, message: '用户名长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                password: [
                    {
                        required: true,
                        validator: validates('password', '密码必须包含字母和数字,长度最少为6位', '密码不能为空！'),
                        trigger: 'blur'
                    }
                ]
            },
            varifyRules: {
                account: [
                    { min: 6, max: 16, message: '用户名长度在 6 到 16 个字符', trigger: 'blur' },
                    {
                        required: true,
                        validator: validates('account', '用户名格式错误', '用户名不能为空！', this),
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        validator: validates('email', '邮箱格式错误', '邮箱不能为空！'),
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        validator: validates('password', '密码必须由数字、字母或符号至少两种组合,长度最少为6位', '密码不能为空！'),
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        validator: validates('name', '昵称只能由中英文、数字、下划线或减号组成', '昵称不能为空！'),
                        trigger: 'blur'
                    },
                    { min: 2, max: 6, message: '昵称长度在 2 到 6 个字符', trigger: 'blur' }
                ]
            },
            errMessage: ''
        };
    },
    computed: {},
    methods: {
        toggleBtn() {
            this.isLogin = !this.isLogin;
            this.isVarify = false;
            this.errMessage = '';
            this.loginModel = {};
            // this.registeModel = {};
            Object.keys(this.registeModel).forEach((item) => (this.registeModel[item] = ''));
        },
        closeDialog() {
            this.$store.commit('dialogStatus', false)
            this.loginModel = {};
            this.isLogin = true;
            this.isVarify = false;
        },
        // 触发验证
        varify(formName) {
            this.$refs[formName].validate((valid) => {
                console.log(valid);
                if (valid) {
                    if (!this.isVarify) {
                        let appid = '2044321140'; // 腾讯云控制台中对应这个项目的 appid
                        //生成一个滑块验证码对象
                        const _this = this;
                        let captcha = new TencentCaptcha(appid, function (res) {
                            // 用户滑动结束或者关闭弹窗，腾讯返回的内容
                            console.log(res);
                            if (res.ret === 0) {
                                //成功，传递数据给后台进行验证
                                _this.isVarify = true;
                            } else {
                                // 提示用户完成验证
                            }
                        });
                        // 滑块显示
                        captcha.show();
                    }
                } else {
                    return false;
                }
            });
        },
        // 登录
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http2
                        .post('login', this.loginModel)
                        .then((res) => {
                            console.log(res);
                            localStorage.token = res.data.token;
                            this.$store.dispatch('setUser', res.data.user);
                            console.log(this.$store.state.isLogin);
                            window.location.reload();
                        })
                        .catch((err) => {
                            this.errMessage = err.response.data.message;
                        });
                } else {
                    return false;
                }
            });
        },
        // 注册
        setRegister(formName) {
            this.$refs[formName].validate(async (valid) => {
                console.log(valid);
                if (valid) {
                    if (!this.isVarify) {
                        this.$notify({
                            title: '提交失败',
                            message: '请先完成验证',
                            type: 'warning',
                            duration: 2000
                        });
                    } else {
                        console.log(this.registeModel);
                        this.registeModel.datetime = new Date();
                        const res = await this.$http2.post('rest/users', this.registeModel);
                        // res = await this.$http.post('rest/users', this.model);
                        this.isVarify = false;
                    }
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss">
$color: rgb(252, 229, 24);
$color-success: #3cd04f;
@keyframes dialogOpen {
    0% {
        -webkit-transform: matrix3d(0.7);
        transform: matrix3d(0.7, 0, 0, 0, 0, 0.7, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        opacity: 0;
    }
    3.4% {
        -webkit-transform: matrix3d(0.795, 0, 0, 0, 0, 0.822, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.795, 0, 0, 0, 0, 0.822, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    4.7% {
        -webkit-transform: matrix3d(0.835, 0, 0, 0, 0, 0.88, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.835, 0, 0, 0, 0, 0.88, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    6.81% {
        -webkit-transform: matrix3d(0.898, 0, 0, 0, 0, 0.968, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.898, 0, 0, 0, 0, 0.968, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    9.41% {
        -webkit-transform: matrix3d(0.965, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.965, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    10.21% {
        -webkit-transform: matrix3d(0.982, 0, 0, 0, 0, 1.068, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.982, 0, 0, 0, 0, 1.068, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    13.61% {
        -webkit-transform: matrix3d(1.037, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.037, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    14.11% {
        -webkit-transform: matrix3d(1.042, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.042, 0, 0, 0, 0, 1.099, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    17.52% {
        -webkit-transform: matrix3d(1.062, 0, 0, 0, 0, 1.072, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.062, 0, 0, 0, 0, 1.072, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    18.72% {
        -webkit-transform: matrix3d(1.064, 0, 0, 0, 0, 1.056, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.064, 0, 0, 0, 0, 1.056, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    21.32% {
        -webkit-transform: matrix3d(1.059, 0, 0, 0, 0, 1.021, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.059, 0, 0, 0, 0, 1.021, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    24.32% {
        -webkit-transform: matrix3d(1.045, 0, 0, 0, 0, 0.988, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.045, 0, 0, 0, 0, 0.988, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    25.23% {
        -webkit-transform: matrix3d(1.04, 0, 0, 0, 0, 0.981, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.04, 0, 0, 0, 0, 0.981, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    29.03% {
        -webkit-transform: matrix3d(1.019, 0, 0, 0, 0, 0.969, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.019, 0, 0, 0, 0, 0.969, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    29.93% {
        -webkit-transform: matrix3d(1.014, 0, 0, 0, 0, 0.97, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.014, 0, 0, 0, 0, 0.97, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    35.54% {
        -webkit-transform: matrix3d(0.994, 0, 0, 0, 0, 0.989, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.994, 0, 0, 0, 0, 0.989, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    36.74% {
        -webkit-transform: matrix3d(0.991, 0, 0, 0, 0, 0.994, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.991, 0, 0, 0, 0, 0.994, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    41.04% {
        -webkit-transform: matrix3d(0.988, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.988, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    44.44% {
        -webkit-transform: matrix3d(0.99, 0, 0, 0, 0, 1.01, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.99, 0, 0, 0, 0, 1.01, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    52.15% {
        -webkit-transform: matrix3d(0.997, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(0.997, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        opacity: 1;
    }
    59.86% {
        -webkit-transform: matrix3d(1.002, 0, 0, 0, 0, 0.997, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.002, 0, 0, 0, 0, 0.997, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    63.26% {
        -webkit-transform: matrix3d(1.002, 0, 0, 0, 0, 0.998, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1.002, 0, 0, 0, 0, 0.998, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    75.28% {
        -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1.001, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1, 0, 0, 0, 0, 1.001, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    85.49%,
    90.69%,
    100% {
        -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    100% {
        opacity: 1;
    }
}
@keyframes open {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.6; /*圆形放大的同时，透明度逐渐减小为0*/
    }
    100% {
        transform: scale(1.3);
        opacity: 0;
    }
}
#dialog-card {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    .v-card {
        animation: dialogOpen 2s;
        border-radius: 1em;
        width: 490px;
        // height: 490px;
        box-sizing: border-box;
        padding: 20px;
        .back-btn {
            button {
                border: none;
                outline: 0;
                border-radius: 0.5em;
                .icon-item {
                    padding: 0 10px;
                    font-size: 20px;
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                }
            }
            button:focus {
                background: #cccccc;
            }
        }
        .login-content {
            padding: 16px 28px 44px;
            .login-header {
                * {
                    margin: 0;
                    font-weight: bold;
                }
                .header-top-fir {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .register-btn {
                        height: 32px;
                        width: 60px;
                        border: none;
                        border-radius: 0.5em;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        position: relative;
                        //隐藏溢出的径向渐变背景
                        overflow: hidden;
                        outline: 0;
                        cursor: pointer;
                    }
                    .register-btn:after {
                        content: '';
                        display: block;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        pointer-events: none;
                        //设置径向渐变
                        background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
                        background-repeat: no-repeat;
                        background-position: 50%;
                        transform: scale(10, 10);
                        opacity: 0;
                        transition: transform 0.5s, opacity 1s;
                    }

                    .register-btn:active:after {
                        outline: 0;
                        transform: scale(0, 0);
                        opacity: 0.5;
                        //设置初始状态
                        transition: 0s;
                    }
                }
                .header-top-sec {
                    margin-top: 0.5rem;
                }
            }
            .login-main {
                margin-top: 1rem;
                .el-form-item {
                    margin-bottom: 0.5rem;
                    .el-form-item__label {
                        display: flex;
                        font-weight: bolder;
                        font-size: 17px;
                    }
                    .input-group {
                        border: 1px solid transparent;
                        font-size: 14px;
                        font-family: Haas Grot Text R Web, Helvetica Neue, Helvetica, Arial, sans-serif;
                        font-weight: 400;
                        line-height: 24px;
                        box-sizing: border-box;
                        height: 40px;
                        outline: none;
                        border-radius: 8px;
                        transition: background-color 0.2s ease, outline 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
                        max-height: inherit;
                        .el-input__inner {
                            border-radius: 8px;
                        }
                        .el-input__suffix {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            .iview-btn {
                                display: flex;
                                border: none;
                                cursor: pointer;
                                background-color: unset;
                                outline: 0;
                                font-size: 17px;
                            }
                            .err-tip {
                                color: #f56c6c;
                                box-sizing: border-box;
                                font-size: 16px;
                            }
                        }
                    }
                }
                .form-btn {
                    width: 100%;
                    align-items: center;
                    display: flex;
                    justify-content: inherit;
                    margin: 20px 0;
                    padding: 10px 0;
                    border-radius: 1em;
                    border: none;
                    outline: 0;
                    background-color: #0478be;
                    span {
                        color: inherit;
                        flex: 1 0 auto;
                        line-height: normal;
                        position: relative;
                        color: #fff;
                    }
                }
                .captcha:hover {
                    .captcha-circle-border {
                        animation: open 1s linear infinite;
                    }
                }
                .captcha-border {
                    border: 1px solid #26c267 !important;
                }
                .captcha {
                    box-sizing: border-box;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border: 1px solid #e0e0e0;
                    background: #e9ecff;
                    background-image: linear-gradient(180deg, #fff, #f3f3f3);
                    border-radius: 8px;
                    padding: 8px 10px;
                    margin: 1.5rem 0;
                    cursor: pointer;
                    height: 45px;
                    .captcha-overlay {
                        position: absolute;
                        width: 0;
                        height: 100%;
                        background: #eefff5;
                        top: 0;
                        right: 0;
                        border-radius: 8px;
                    }
                    .captcha-show {
                        width: 100%;
                        transition: width 0.6s ease-in-out;
                        // z-index: 0;
                    }
                    .captcha-left {
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        .captcha-left-icon {
                            width: 40px;
                            .captcha-circle {
                                position: relative;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                margin: 0 14px;

                                .captcha-circle-border {
                                    position: absolute;
                                    left: 50%;
                                    top: 50%;
                                    margin-left: -13px;
                                    margin-top: -13px;
                                    border: 1px solid $color;
                                    height: 24px;
                                    width: 24px;
                                    border-radius: 50%;
                                }
                            }
                            .captcha-success {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                .icon-item {
                                    font-size: 40px;
                                }
                            }
                        }
                        .captcha-text {
                            color: #636ec1;
                            font-size: 12px;
                            margin-left: 10px;
                        }
                        .Varify-text {
                            color: $color-success;
                        }
                    }
                    .captcha-right {
                        z-index: 2;
                        .icon-item {
                            font-size: 24px;
                        }
                    }
                }
            }
        }
    }
}
</style>