<template>
    <div id="user">
        <div class="container users-main">
            <div class="user-card">
                <div class="page bg-white">
                    <div class="user-background"></div>
                    <div class="user-item-flex">
                        <div class="user-avatar">
                            <img :src="user.avatar" alt="" />
                            <div class="user-avatar-change" v-if="isLogin">
                                <div class="avatar-background"></div>
                                <svg-icon icon-class="upload" class="avatar-svg"></svg-icon>
                                <span class="avatar-UploadPicture text-white">修改我的头像</span>
                            </div>
                            <input
                                type="file"
                                v-if="isLogin"
                                accept="image/*"
                                @change="handleFile"
                                class="UploadPicture-input"
                            />
                        </div>
                        <div class="user-item-column">
                            <div class="user-name">
                                <div class="name-text" v-if="this.switch.name">
                                    <div class="fs-xxl text-white user-name-text">{{ user.name }}</div>
                                    <button v-if="isChange" class="change-btn ripple" @click="changeContent('name')">
                                        <svg-icon icon-class="edit" class="edit-svg"></svg-icon>
                                    </button>
                                </div>
                                <div class="user-item-change" v-else="!switch.name">
                                    <div class="user-change-main">
                                        <textarea class="user-input" rows="2" v-model="changeUser.name"></textarea>
                                    </div>
                                    <div class="user-change-btn">
                                        <button class="change-close-btn ripple" @click="closeChange('name')">
                                            <span class="change-border">
                                                <svg-icon icon-class="close" class="edit-svg"></svg-icon>
                                            </span>
                                        </button>
                                        <button class="change-save-btn ripple" @click="saveChange('name')">
                                            <span class="change-border">
                                                <svg-icon icon-class="save"></svg-icon>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="user-jurisdiction">
                                <span class="dec-text" v-if="user.jurisdiction">{{ user.jurisdiction.name }}</span>
                            </div>
                            <div v-if="!this.$store.state.mobile" class="user-description">
                                <div class="text-grey desc-text" v-if="this.switch.desc">
                                    <div class="user-desc">{{ user.desc }}</div>
                                    <button v-if="isChange" class="change-btn ripple" @click="changeContent('desc')">
                                        <svg-icon icon-class="edit" class="edit-svg"></svg-icon>
                                    </button>
                                </div>
                                <div class="user-item-change" v-else="!switch.desc">
                                    <div class="user-change-main">
                                        <textarea class="user-input" rows="2" v-model="changeUser.desc"></textarea>
                                    </div>
                                    <div class="user-change-btn">
                                        <button class="change-close-btn ripple" @click="closeChange('desc')">
                                            <span class="change-border">
                                                <svg-icon icon-class="close" class="edit-svg"></svg-icon>
                                            </span>
                                        </button>
                                        <button class="change-save-btn ripple" @click="saveChange('desc')">
                                            <span class="change-border">
                                                <svg-icon icon-class="save"></svg-icon>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="isLogin && !this.$store.state.mobile" class="user-btn">
                            <button
                                class="ripple"
                                :class="[isChange ? 'bg-danger' : 'bg-primary']"
                                :disabled="disable"
                                @click="toggleUser"
                            >
                                {{ isChange ? '退出编辑模式' : '编辑个人资料' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- pc -->
            <div class="user-main" v-if="!this.$store.state.mobile">
                <div class="page user-page-left bg-white">
                    <div class="user-left-title">
                        <h3>个人资料</h3>
                    </div>
                    <div class="user-left-main">
                        <el-form :model="user">
                            <div class="user-messages">
                                <div class="user-messages-left">
                                    <span class="user-message-label">邮箱</span>
                                </div>
                                <div class="user-messages-right" v-if="this.switch.email">
                                    <span class="user-message-text">{{ user.email ? user.email : '-' }}</span>
                                    <button
                                        v-if="isChange"
                                        name="email"
                                        type="button"
                                        class="change-btn ripple"
                                        @click="changeContent('email')"
                                    >
                                        <svg-icon icon-class="edit" class="edit-svg"></svg-icon>
                                    </button>
                                </div>
                                <div class="user-item-change" v-else="!switch.email">
                                    <div class="user-main-change-btn">
                                        <button class="change-close-btn ripple" @click="closeChange('email')">
                                            <span class="change-border">
                                                <svg-icon icon-class="close" class="edit-svg"></svg-icon>
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            class="change-save-btn ripple"
                                            @click="saveChange('email')"
                                        >
                                            <span class="change-border">
                                                <svg-icon icon-class="save"></svg-icon>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="user-main-change-main">
                                        <textarea class="user-input" rows="1" v-model="changeUser.email"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="user-messages">
                                <div class="user-messages-left">
                                    <span class="user-message-label">注册时间</span>
                                </div>
                                <div class="user-messages-right">
                                    <span class="user-message-text">{{ user.datetime | playTimeFormat }}</span>
                                </div>
                            </div>
                            <div class="user-messages">
                                <div class="user-messages-left">
                                    <span class="user-message-label">手机号</span>
                                </div>
                                <div class="user-messages-right" v-if="this.switch.tel">
                                    <span class="user-message-text">{{ user.tel ? user.tel : '-' }}</span>
                                    <button
                                        v-if="isChange"
                                        name="tel"
                                        type="button"
                                        class="change-btn ripple"
                                        @click="changeContent('tel')"
                                    >
                                        <svg-icon icon-class="edit" class="edit-svg"></svg-icon>
                                    </button>
                                </div>
                                <div class="user-item-change" v-else="!switch.tel">
                                    <div class="user-main-change-btn">
                                        <button class="change-close-btn ripple" @click="closeChange('tel')">
                                            <span class="change-border">
                                                <svg-icon icon-class="close" class="edit-svg"></svg-icon>
                                            </span>
                                        </button>
                                        <button type="button" class="change-save-btn ripple" @click="saveChange('tel')">
                                            <span class="change-border">
                                                <svg-icon icon-class="save"></svg-icon>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="user-main-change-main">
                                        <textarea class="user-input" rows="1" v-model="changeUser.tel"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="user-messages">
                                <div class="user-messages-left">
                                    <span class="user-message-label">性别</span>
                                </div>
                                <div class="user-messages-right" v-if="this.switch.sex">
                                    <span class="user-message-text">{{ user.sex ? user.sex : '-' }}</span>
                                    <button
                                        v-if="isChange"
                                        name="sex"
                                        type="button"
                                        class="change-btn ripple"
                                        @click="changeContent('sex')"
                                    >
                                        <svg-icon icon-class="edit" class="edit-svg"></svg-icon>
                                    </button>
                                </div>
                                <div class="user-item-change" v-else="!switch.sex">
                                    <div class="user-main-change-btn">
                                        <button class="change-close-btn ripple" @click="closeChange('sex')">
                                            <span class="change-border">
                                                <svg-icon icon-class="close" class="edit-svg"></svg-icon>
                                            </span>
                                        </button>
                                        <button type="button" class="change-save-btn ripple" @click="saveChange('sex')">
                                            <span class="change-border">
                                                <svg-icon icon-class="save"></svg-icon>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="user-main-change-check">
                                        <el-radio-group v-model="changeUser.sex" size="mini" fill="#607d8b">
                                            <el-radio-button label="男"></el-radio-button>
                                            <el-radio-button label="女"></el-radio-button>
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>
                            <div class="user-messages">
                                <div class="user-messages-left">
                                    <span class="user-message-label">年龄</span>
                                </div>
                                <div class="user-messages-right" v-if="this.switch.age">
                                    <span class="user-message-text">{{ user.age ? user.age : '-' }}</span>
                                    <button
                                        v-if="isChange"
                                        name="age"
                                        type="button"
                                        class="change-btn ripple"
                                        @click="changeContent('age')"
                                    >
                                        <svg-icon icon-class="edit" class="edit-svg"></svg-icon>
                                    </button>
                                </div>
                                <div class="user-item-change" v-else="!switch.age">
                                    <div class="user-main-change-btn">
                                        <button class="change-close-btn ripple" @click="closeChange('age')">
                                            <span class="change-border">
                                                <svg-icon icon-class="close" class="edit-svg"></svg-icon>
                                            </span>
                                        </button>
                                        <button type="button" class="change-save-btn ripple" @click="saveChange('age')">
                                            <span class="change-border">
                                                <svg-icon icon-class="save"></svg-icon>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="user-main-change-check">
                                        <el-input-number
                                            v-model="changeUser.age"
                                            controls-position="right"
                                            :min="1"
                                            :max="150"
                                            size="small"
                                        ></el-input-number>
                                    </div>
                                </div>
                            </div>
                            <div class="user-messages">
                                <div class="user-messages-left">
                                    <span class="user-message-label">位置</span>
                                    <span class="user-message-text">{{ user.seat ? user.seat : '-' }}</span>
                                </div>
                                <button v-if="isChange" type="button" class="change-btn ripple" @click="changeContent">
                                    <svg-icon icon-class="edit" class="edit-svg"></svg-icon>
                                </button>
                            </div>
                        </el-form>
                    </div>
                </div>
                <div class="page user-page-right bg-white"></div>
            </div>
            <!-- h5 -->
            <div v-else class="user-main-h5">
                <div v-if="isLogin" class="user-main-item">
                    <span class="user-mian-item-left text-grey">
                        <svg-icon iconClass="user" class="item-info-icon"></svg-icon>
                    </span>
                    <span class="user-mian-item-desc font-a" @click="isEdit = true"
                        >点击完善资料
                        <svg-icon iconClass="info-white" class="item-info-icon"></svg-icon>
                    </span>
                </div>
                <div class="user-main-item">
                    <span class="user-mian-item-left text-grey">个性签名 </span>
                    <span class="user-mian-item-desc font-a">{{ user.desc ? user.desc : '-' }} </span>
                </div>
                <div class="user-main-item">
                    <span class="user-mian-item-left text-grey">性别 </span>
                    <span class="user-mian-item-desc font-a">{{ user.sex ? user.sex : '-' }} </span>
                </div>
                <div class="user-main-item">
                    <span class="user-mian-item-left text-grey">年龄 </span>
                    <span class="user-mian-item-desc font-a">{{ user.age ? user.age : '-' }} </span>
                </div>
                <div class="user-main-item">
                    <span class="user-mian-item-left text-grey">注册时间 </span>
                    <span class="user-mian-item-desc font-a">{{ user.datetime | playTimeFormat }} </span>
                </div>
                <div class="user-main-item">
                    <span class="user-mian-item-left text-grey">联系方式 </span>
                    <span class="user-mian-item-desc font-a">{{ user.email ? user.email : '-' }} </span>
                </div>
                <user-edit-h5 :user="user" :class="isEdit ? 'edit-content-show' : 'edit-content-close'"></user-edit-h5>
            </div>
        </div>
    </div>
</template>

<script>
import UserEditH5 from '../components/h5_components/userEdit_h5/userEdit_h5.vue';
import SvgIcon from '../components/SvgIcon/SvgIcon.vue';
export default {
    components: { SvgIcon,  UserEditH5},

    data() {
        return {
            user: {},
            changeUser: {
            },
            isLogin: false,
            isChange: false,
            switch: {
                name: true,
                desc: true,
                email: true,
                tel: true,
                sex: true,
                age: true
            },
            // H5修改资料
            isEdit: false
        };
    },
    created() {
        this.utils.initializeFlag();
    },
    mounted() {
        this.getUserInfo();
    },
    watch: {
        $route(to, from) {
            this.$router.go(0);
        }
    },
    computed: {
        disable() {
            return Object.values(this.switch).findIndex((key) => key == false) != -1;
        }
    },
    methods: {
        async getUserInfo() {
            const { data: res } = await this.$http2.get(`rest/users/${this.$route.params.id}`);
            this.user = res;
            if (this.$store.state.currentUser) {
                const nowAccount = this.$store.state.currentUser.account;
                if (this.user.account === nowAccount) {
                    this.isLogin = true;
                }
            }
            console.log(res);
        },
        async handleFile(e) {
            let $target = e.target || e.srcElement;
            let $file = $target.files[0];
            if ($file) {
                const formdata = new FormData();
                formdata.append('file', $file);
                const res = await this.$http2.post('upload', formdata);
                this.user.avatar = res.data.url;
                // console.log(this.user);
                this.editUser(this.user);
            }
        },
        async editUser(user) {
            const res = await this.$http2.put(`rest/users/${this.user._id}`, user);
            this.$store.dispatch('setUser', this.user);
            this.changeUser = {};
        },
        toggleUser() {
            this.isChange = !this.isChange;
        },
        closeChange($el) {
            this.switch[$el] = true;
            this.disable;
            this.changeUser = {};
        },
        changeContent($el) {
            this.switch[$el] = false;
            this.changeUser[$el] = this.user[$el];
            this.disable;
        },
        saveChange(model) {
            this.editUser(this.changeUser);
            this.getUserInfo();
            this.switch[model] = true;
        }
    }
};
</script>

<style lang="scss">
#user {
    height: 90%;
    .users-main {
        display: block !important;
    }
    .container {
        padding-top: 60px;
    }
    .user-item-change {
        // width: 80%;
        .user-main-change-main {
            float: right;
            width: 70%;
            height: 28px;
            .user-input {
                font-size: 13px;
            }
        }
        .user-main-change-check {
            float: right;
            .el-radio-group {
            }
        }
        .user-change-main {
            // position: absolute;
            float: left;
            width: 70%;
        }
        .user-input {
            border: none;
            border-bottom: 1px solid #000;
            font-family: initial;
            background-color: #ececec;
            padding: 5px;
            resize: none;
            font-size: 16px;
            position: relative;
            box-sizing: border-box;
            width: 100%;
            // width: 100%;
            // text-overflow: hidden;
        }
        .user-input::-webkit-scrollbar {
            width: 5px;
        }
        .user-input::-webkit-scrollbar-thumb {
            border-radius: 5%;
            background-color: transparent;
            border: 3px solid #ccc;
        }
        .user-main-change-btn {
            display: flex;
            float: right;
            // width: 30%;
        }
        .user-change-btn {
            display: flex;
            flex-direction: column;
            width: 26px;
        }
        button {
            height: 26px;
            width: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 1px;
            cursor: pointer;
            border: none;
            outline: 0;
            background-color: #fff;
        }
        .change-close-btn:hover {
            background-color: #f6d6d6;
        }
        .change-save-btn:hover {
            background-color: #dff0ff;
        }

        .change-border {
            align-items: center;
            color: inherit;
            display: flex;
            flex: 1 0 auto;
            justify-content: inherit;
            line-height: normal;
            position: relative;
        }
    }
    .user-input:focus {
        outline: 0;
    }
    .change-btn {
        height: 24px;
        width: 24px;
        border-radius: 50%;
        right: 0;
        // margin: 1px;
        cursor: pointer;
        border: none;
        outline: 0;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        .edit-svg {
            position: fixed;
            font-size: 20px;
        }
        // float: right;
    }
    .change-btn:hover {
        background-color: #dff0ff;
    }
    .user-card {
        padding: 0 10px;
        box-sizing: border-box;
        // height: 350px;
        .page {
            box-sizing: border-box;
            padding: 1px 0;
            .user-background {
                box-sizing: border-box;
                background-color: #000;
                width: 100%;
                height: 250px;
                margin-bottom: 100px;
            }
            .user-item-flex {
                display: flex;
                position: absolute;
                // z-index: 1;
                width: 100%;
                height: 200px;
                bottom: 0;
                align-items: center;
                padding: 10px 0;
                .user-avatar {
                    border: 3px solid #fff;
                    border-radius: 5%;
                    height: 200px;
                    width: 200px;
                    margin-left: 10px;
                    img {
                        width: 200px;
                        height: 200px;
                        border-radius: 5%;
                        object-fit: cover;
                    }
                    .UploadPicture-input {
                        position: absolute;
                        top: 10px;
                        left: 13px;
                        width: 200px;
                        height: 200px;
                        z-index: 9;
                        opacity: 0;
                        cursor: pointer;
                    }
                    .user-avatar-change {
                        // background-color: #ccc;
                        height: 200px;
                        width: 200px;
                        position: absolute;
                        top: 10px;
                        // opacity: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        .avatar-background {
                            position: absolute;
                            height: 100%;
                            width: 100%;
                            background: #ccc;
                            opacity: 0;
                        }
                        .avatar-svg {
                            opacity: 0;
                            font-size: 60px;
                            padding: 10px;
                            z-index: 1;
                        }

                        .avatar-UploadPicture {
                            opacity: 0;
                            padding: 10px;
                            font-size: 19px;
                            z-index: 1;
                        }
                    }
                }
                .user-avatar:hover {
                    .user-avatar-change {
                        cursor: pointer;
                        .avatar-background {
                            opacity: 0.5;
                        }
                        .avatar-svg {
                            opacity: 1;
                        }
                        .avatar-UploadPicture {
                            opacity: 1;
                        }
                    }
                }
                .user-item-column {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    padding: 10px;
                    position: relative;
                    width: 60%;
                }
                .user-name {
                    font-weight: bold;
                    height: 50%;
                    display: flex;
                    align-items: center;
                    .name-text {
                        .user-name-text {
                            float: left;
                        }
                    }
                }
                .user-jurisdiction {
                    height: 25%;
                    display: flex;
                    // align-items: center;
                    justify-content: center;
                    flex-direction: inherit;
                    .dec-text {
                        color: #a9990b;
                    }
                }
                .user-description {
                    height: 25%;
                    display: flex;
                    // align-items: center;
                    justify-content: center;
                    flex-direction: inherit;
                    span {
                        padding: 5px 0;
                    }
                    .desc-text {
                        height: 28px;
                        .user-desc {
                            height: 28px;
                            overflow: hidden;
                            float: left;
                            line-height: 28px;
                        }
                    }
                }
                .user-btn {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    margin: 20px;
                    button {
                        height: 36px;
                        text-align: center;
                        font-weight: bold;
                        border-radius: 5px;
                        padding: 0 15px;
                        border: none;
                    }
                }
            }
        }
    }
    .user-main {
        padding: 10px;
        .page {
            float: left;
            margin: 0;
            padding: 10px 20px;
        }
        .user-page-left {
            width: 35%;
            margin-right: 2%;
            .user-left-title h3 {
                margin: 10px;
            }
            .user-left-main {
                padding: 10px 0;
                .user-messages {
                    box-sizing: border-box;
                    padding: 12px 10px 6px 10px;
                    border-bottom: 1px solid #ccc;
                    font-size: 15px;
                    // height: 47px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    .user-messages-left {
                        display: flex;
                    }
                    .user-messages-right {
                        .user-message-text {
                            float: left;
                        }
                    }
                }
            }
        }
        .user-page-right {
            width: 63%;
        }
    }
}
</style>