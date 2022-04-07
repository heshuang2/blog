<template>
    <div id="reset" :class="this.$store.state.theme ? 'bg-light text-black' : 'bg-dark text-white'">
        <div class="reset-content" >
            <div class="reset-top-fir">
                <h2>{{ isNext ? '找回密码' : '设置新密码' }}</h2>
                <h3 class="text-grey">{{ isNext ? '验证码将会发送至你的注册邮箱' : '新密码应不少于6位，由数字、字母或符号至少两种组合' }}</h3>
            </div>
            <div class="rest-main-fir">
                <el-form v-if="isNext" ref="resetForm"
                         class="login-main" :model="resetModel"
                         :rules="resetRules" :key="1">
                    <el-form-item prop="email">
                        <el-input placeholder="请输入你的邮箱号" v-model="resetModel.email"></el-input>
                    </el-form-item>
                    <el-form-item prop="email_code">
                        <el-input v-model="resetModel.email_code">
                             <span slot="suffix" v-show="errMessage != ''" class="err-tip">
                                <div>{{ errMessage }}</div>
                            </span>
                            <el-button v-if="isMail" slot="append" class="mail-btn ripple"
                                       @click="fecthMail('resetForm')">发送验证码
                            </el-button>
                            <template v-else slot="append">
                                <countdown ref="countdown" :isMail.sync="isMail"></countdown>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button class="form-btn ripple" @click.native.prevent="nextForm('resetForm')">
                        <span>下一步</span>
                    </el-button>
                </el-form>
                <el-form v-else ref="resetPasswordForm"
                         class="login-main" :model="resetModel"
                         :rules="resetRules" :key="2">
                    <el-form-item prop="comparePassword">
                        <el-input placeholder="新密码" v-model="resetModel.comparePassword"  :type="isPassword1 ? 'password' : 'text'">
                            <button
                                slot="suffix"
                                class="iview-btn bg-light"
                                @click="isPassword1 = !isPassword1"
                                type="button"
                            >
                                <svg-icon :icon-class="isPassword1 ? '不可见' : '可见'" class="icon-item"></svg-icon>
                            </button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="请再次输入新密码" v-model="resetModel.password"  :type="isPassword2 ? 'password' : 'text'">
                            <button
                                slot="suffix"
                                class="iview-btn bg-light"
                                @click="isPassword2 = !isPassword2"
                                type="button"
                            >
                                <svg-icon :icon-class="isPassword2 ? '不可见' : '可见'" class="icon-item"></svg-icon>
                            </button>
                        </el-input>
                        <div v-if="errTip !== ''" class="err_tip_bottom">{{ errTip }}</div>
                    </el-form-item>
                    <el-button class="form-btn ripple" @click.native.prevent="resetPassword('resetPasswordForm')">
                        <span>重置密码</span>
                    </el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

import Countdown from '../../src/components/verification/Countdown.vue';
import { obtainError, validates } from '../utils/validate';

export default {
    name: 'reset',
    components: { Countdown },
    data() {
        return {
            isMail: true, // 发送验证码倒计时隐藏
            isNext: true, // 验证邮箱成功
            errMessage: '', // 邮箱验证码报错信息
            resetModel: {}, // 重置密码表单
            errTip: '', // 两次输入密码不一致
            isPassword1: true, // 密码是否可见
            isPassword2: true, // 密码是否可见
            resetRules: {
                email: [
                    {
                        required: true,
                        validator: obtainError('email', '邮箱格式错误', '邮箱不能为空！', this),
                        trigger: 'blur'
                    }
                ],
                email_code: [
                    {
                        required: true,
                        validator: validates('email_code', '验证码由数字组合', '验证码不能为空！')
                    }
                ],
                comparePassword: [
                    {
                        required: true,
                        validator: validates('password', '密码必须由数字、字母或符号至少两种组合,长度最少为6位', '密码不能为空！'),
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        validator: validates('password', '密码必须由数字、字母或符号至少两种组合,长度最少为6位', '密码不能为空！'),
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    watch: {
        'resetModel.password'() {
            this.errTip = '';
        }
    },
    methods: {
        // 获取邮箱验证码
        fecthMail(formName) {
            this.$refs[formName].validateField('email', (valid) => {
                if (valid) {
                    return false;
                } else {
                    this.isMail = false;
                    this.$http2.post('getMailCode', this.resetModel).then(res => {
                        console.log(res);
                    });
                    this.$nextTick(() => {
                        this.$refs.countdown.runAnimation();
                    });
                }
            });
        },
        // 验证邮箱验证码
        nextForm(formName) {
            this.$refs[formName].validate((valid) => {
                console.log(valid);
                if (valid) {
                    this.$http2.post(`verification`, this.resetModel).then(res => {
                        console.log(res);
                        this.isNext = false;
                    }).catch(err => {
                        console.log(err);
                        this.errMessage = err.data.message;

                    });
                } else {
                    return false;
                    /*this.$http2.post('getMailCode', this.resetModel).then(res => {
                        console.log(res);
                    });*/
                }
            });
        },
        // 重置密码
        resetPassword(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.resetModel.comparePassword !== this.resetModel.password) {
                        this.errTip = '两次输入不一致';
                        return false;
                    }
                    const toast = this.$Toast.loading({
                        duration: 0
                    });
                    this.$http2.put(`rest/users/${this.$store.state.resetUserId}`, this.resetModel).then(res => {
                        console.log(res);
                        toast.clear();
                        if (this.$store.state.mobile) {
                            this.$Toast.success('密码修改成功');
                        } else  {
                            this.$message({
                                message: '密码修改成功',
                                type: 'success'
                            })
                        }
                        this.$router.push('/home');
                    }).catch(err => {
                        return err
                    })
                } else {
                    return false;
                    /*this.$http2.post('getMailCode', this.resetModel).then(res => {
                        console.log(res);
                    });*/
                }
            });
        }
    }
};
</script>

<style lang="scss">
#reset {
    min-height: calc(100% - 5rem);
    display: flex;
    align-items: center;
    justify-content: center;

    .reset-content {
        padding: 1rem;
        border-radius: 1rem;
        z-index: 9;
        width: 350px;

        .reset-top-fir {
            h2 {
                font-weight: bold;
            }

            h2, h3 {
                margin: 10px;
            }
        }

        .rest-main-fir {
            margin: 1rem 0;

            .mail-btn {
                background: rgb(252, 229, 24);
                color: #000;
                border: none !important;
                font-size: 16px;
                margin-left: 20px;
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
                    //color: inherit;
                    flex: 1 0 auto;
                    line-height: normal;
                    position: relative;
                    color: #fff;
                    font-size: 16px;
                }
            }

            .err_tip_bottom {
                position: absolute;
                bottom: -30px;
                color: #F56C6C;
                font-size: 12px;
            }
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
                font-size: 13px;
            }
        }

        .el-input-group__append {
            border: none !important;
        }
    }

}

</style>