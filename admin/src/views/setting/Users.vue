<template>
    <div id="users">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" disabled @click="isDialog = true">新建</el-button>
            </div>
            <el-table :data="users.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border>
                <el-table-column type="index" label="ID" width="50" align="center"></el-table-column>
                <el-table-column label="用户名" prop="name" align="center"> </el-table-column>
                <el-table-column label="权限" align="center" width="300">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.jurisdiction.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="">
                    <template slot-scope="scope">
                        <el-tag :type="status[scope.row.online].online">{{status[scope.row.online].state}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="锁定" width="300" align="center">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.locking ? '否' : '是'" placement="top">
                            <el-switch
                                v-model="scope.row.locking"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="userStatus(scope.row._id, scope.$index)"
                            >
                            </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column flexd="right" label="操作" width="350" align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click="edit(scope.row._id)"
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            size="small"
                        ></el-button>
                        <el-button
                            @click="remove(scope.row)"
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="small"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin-top: 0.625rem"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="users.length"
                :current-page="currentPage"
                :page-sizes="[1, 5, 10]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
            <!-- 新建日常 -->
            <el-dialog :visible.sync="isDialog" destroy-on-close :before-close="isClose" @closed="newDialog">
                <el-card style="border-radius: 0; margin: 0">
                    <div slot="header" class="clearfix">
                        <span class="dialog-title">{{ isEdit ? '编辑' : '新建' }}用户</span>
                    </div>
                    <el-form
                        label-width="3rem"
                        style="width: 100%"
                        label-position="left"
                        @submit.native.prevent="save(model._id)"
                    >
                        <el-form-item label="昵称">
                            <el-input placeholder="请输入内容" v-model="model.name"> </el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input placeholder="请输入内容" v-model="model.email"> </el-input>
                        </el-form-item>
                        <el-form-item label="账号">
                            <el-input placeholder="请输入内容" v-model="model.account"> </el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input
                                placeholder="请输入内容"
                                type="password"
                                v-model="model.password"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="头像">
                            <el-upload
                                class="avatar-uploader"
                                :action="$http.defaults.baseURL + '/upload'"
                                :headers="getAuthHeaders()"
                                :show-file-list="false"
                                :on-success="(res) => $set(model, 'avatar', res.url)"
                            >
                                <img v-if="model.avatar" :src="model.avatar" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="权限">
                            <el-select v-model="model.jurisdiction" value-key="name" placeholder="请选择">
                                <el-option
                                    v-for="item of categories"
                                    :key="item._id"
                                    :label="item.name"
                                    :value="item"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="float: right">
                            <el-button @click="isDialog = false">取 消</el-button>
                            <el-button type="primary" native-type="submit">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDialog: false,
            isEdit: false,
            model: {},
            categories: [],
            users: [],
            currentPage: 1,
            pagesize: 5,
            status: [{ online: 'success', state: '在线' }, { online: 'info', state: '离线' }]
        };
    },
    created() {
        this.fetch();
        this.fetchCategories();
    },
    methods: {
        // 请求数据
        async fetch() {
            const res = await this.$http.get('rest/users'); // eslint-disable-line no-unused-vars
            this.users = res.data;
            console.log(this.users);
        },
        // 获取分类列表
        async fetchCategories() {
            const { data: res } = await this.$http.get(`rest/categories`); // eslint-disable-line no-unused-vars
            this.categories = res.find((key) => key.name === '账号权限').children;
        },
        // 删除
        async remove(row) {
            this.$confirm(`是否确认删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    await this.$http.delete(`rest/users/${row._id}`);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.fetch();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        // 新建
        async save(id) {
            let res; // eslint-disable-line no-unused-vars
            if (id) {
                res = await this.$http.put(`rest/users/${id}`, this.model);
            } else {
                this.model.datetime = new Date();
                res = await this.$http.post('rest/users', this.model);
            }
            this.$message({
                type: 'success',
                message: '保存成功'
            });
            this.isDialog = false;
            this.isEdit = false;
            this.fetch();
        },
        // 编辑
        async edit(id) {
            const { data: res } = await this.$http.get(`rest/users/${id}`); // eslint-disable-line no-unused-vars
            this.model = res;
            this.isDialog = true;
            this.isEdit = true;
        },
        isClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        newDialog() {
            this.model = {};
            this.isEdit = false;
        },
        handleSizeChange: function (val) {
            this.pagesize = val;
        },
        handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
        },
        userStatus(id, index) {
            console.log(this.users[index]);
            this.model = this.users[index];
            this.save(id);
        }
    }
};
</script>

<style scoped>
.avatar-uploader-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
}

.avatar {
    width: 100px;
    height: 100px;
}
</style>


