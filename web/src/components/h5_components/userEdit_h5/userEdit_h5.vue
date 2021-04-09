<template>
    <div class="user-edit-content bg-light">
        <div class="user-edit-header bg-light">
            <span class="edit-back-card" @click="$parent.isEdit = false">
                <svg-icon iconClass="back1" class="menu-icon"></svg-icon>
            </span>
        </div>
        <div class="user-edit-body bg-white">
            <div class="user-edit-item font-a">
                <span class="user-edit-item-left text-black">头像</span>
                <span class="user-edit-item-right">
                    <span class="text-grey user-edit-item-desc">
                        <img :src="user.avatar" alt="" />
                        <input type="file" accept="image/*" @change="$parent.handleFile" class="UploadPicture-input" />
                    </span>
                    <svg-icon iconClass="info" class="info-icon"></svg-icon>
                </span>
            </div>
            <div class="user-edit-item font-a">
                <span class="user-edit-item-left text-black">名字</span>
                <span class="user-edit-item-right" @click="editItem(user.name)">
                    <span class="text-grey user-edit-item-desc">
                        {{ user.name }}
                    </span>
                    <svg-icon iconClass="info" class="info-icon"></svg-icon>
                </span>
            </div>
            <div class="user-edit-item font-a">
                <span class="user-edit-item-left text-black">个性签名</span>
                <span class="user-edit-item-right" @click="editItem(user.desc)">
                    <span class="text-grey user-edit-item-desc">
                        {{ user.desc }}
                    </span>
                    <svg-icon iconClass="info" class="info-icon"></svg-icon>
                </span>
            </div>
            <div class="user-edit-item font-a">
                <span class="user-edit-item-left text-black">邮箱</span>
                <span class="user-edit-item-right"  @click="editItem(user.email)">
                    <span class="text-grey user-edit-item-desc">
                        {{ user.email }}
                    </span>
                    <svg-icon iconClass="info" class="info-icon"></svg-icon>
                </span>
            </div>
            <div class="user-edit-item font-a">
                <span class="user-edit-item-left text-black">性别</span>
                <span class="user-edit-item-right">
                    <span class="text-grey user-edit-item-desc">
                        {{ user.sex }}
                    </span>
                    <svg-icon iconClass="info" class="info-icon"></svg-icon>
                </span>
            </div>
            <div class="user-edit-item font-a">
                <span class="user-edit-item-left text-black">年龄</span>
                <span class="user-edit-item-right">
                    <span class="text-grey user-edit-item-desc">
                        {{ user.age }}
                    </span>
                    <svg-icon iconClass="info" class="info-icon"></svg-icon>
                </span>
            </div>
        </div>
        <div class="edit-item-group bg-light" :class="isShowEdit ? 'edit-item-show' : 'edit-item-close'">
            <div class="user-edit-header bg-light">
                <span class="edit-back-card" @click="isShowEdit = false">
                    <svg-icon iconClass="back1" class="menu-icon"></svg-icon>
                </span>
                <span>
                    <van-button class="edit-btn" plain :disabled="value === key"  type="default">保存</van-button>
                </span>
            </div>
            <div class="bg-white edit-item-body">
                <van-cell-group>
                    <van-field v-model="value" clearable />
                </van-cell-group>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../../SvgIcon/SvgIcon.vue';
export default {
    components: { SvgIcon },
    props: {
        user: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            isShowEdit: false,
            value: '',
            key: ''

        };
    },
    methods: {
        editItem(value) {
            this.isShowEdit = true;
            this.key = value;
            this.value = value;
        }
    }
};
</script>

<style lang="scss">
.user-edit-content {
    padding: 0;
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    z-index: 9;
    // color: #fff;/
    transition: all 0.3s linear;
    z-index: 1000;
    .user-edit-header {
        width: 100%;
        height: 3.25rem;
        padding: 1vh 2vh;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .edit-back-card {
            width: 3rem;
            display: flex;
            align-items: center;
            .menu-icon {
                font-size: 1.5rem;
            }
        }
    }
    .user-edit-body {
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        .user-edit-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ccc;
            padding: 1rem 0;
            box-sizing: border-box;
            width: 100%;
            position: relative;
            .user-edit-item-left {
                font-size: 16px;
                font-weight: 500;
            }
            .user-edit-item-right {
                // float: right;
                display: flex;
                align-items: center;
                max-width: 70%;
                padding-right: 1.2rem;
                .user-edit-item-desc {
                    display: flex;
                    align-items: center;
                    overflow-y: auto;
                    position: relative;
                    img {
                        height: 72px;
                        width: 72px;
                        object-fit: cover;
                        border-radius: 5px;
                    }
                    .UploadPicture-input {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 92px;
                        height: 72px;
                        z-index: 9;
                        opacity: 0;
                        cursor: pointer;
                    }
                }

                .info-icon {
                    // padding-left: 0.3125rem;
                    position: absolute;
                    right: 0;
                }
            }
        }
    }
    .edit-item-group {
        width: 100%;
        height: 100%;
        position: fixed;
        // display: flex;
        bottom: 0;
        transition: all 0.3s linear;
        z-index: 10;
        .edit-btn {
            border-radius: 2px;
            height: auto;
            padding: .5rem .65rem;
        }
        .edit-item-body {
            .van-cell {
                font-size: 17px;
            }
        }
    }
    .edit-item-show {
        bottom: 0;
        opacity: 1;
    }
    .edit-item-close {
        // animation: slide-right 0.3s;
        bottom: -100%;
    }
}
.edit-content-show {
    right: 0;
    opacity: 1;
}
.edit-content-close {
    // animation: slide-right 0.3s;
    right: -100%;
}
</style>