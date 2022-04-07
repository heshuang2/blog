<template>
    <div id="linkList">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button icon="el-icon-plus" type="primary" @click="isDialog = true">新建</el-button>
            </div>
            <el-table
                :data="linksList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                :default-sort="{ prop: 'datetime', order: 'ascending' }"
                border
            >
                <el-table-column align="center" label="创建时间" prop="datetime" sortable width="200">
                    <template scope="scope">
                        {{ scope.row.datetime | playTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="博客名称" align="center" width="200"></el-table-column>
                <el-table-column align="center" label="博客头像" width="200">
                    <template slot-scope="scope">
                        <img :src="scope.row.avatar" style="height: 7.5rem; border-radius: 5%" alt="" />
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" label="博客链接">
                    <template slot-scope="scope">
                        <span>{{ scope.row.link }}</span>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" label="博客简介">
                    <template slot-scope="scope">
                        <span>{{ scope.row.desc }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" flexd="right" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button
                            circle
                            icon="el-icon-edit"
                            size="small"
                            type="primary"
                            @click="edit(scope.row._id)"
                        ></el-button>
                        <el-button
                            circle
                            icon="el-icon-delete"
                            size="small"
                            type="danger"
                            @click="remove(scope.row)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :page-sizes="[1, 5, 10]"
                :total="linksList.length"
                layout="total, sizes, prev, pager, next, jumper"
                style="margin-top: 0.625rem"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
            <!-- 新建友链 -->
            <el-dialog :before-close="isClose" :visible.sync="isDialog" width="40%" destroy-on-close @closed="newDialog">
                <el-card style="border-radius: 0; margin: 0">
                    <div slot="header" class="clearfix">
                        <span class="dialog-title">{{ isEdit ? '编辑' : '新建' }}友链</span>
                    </div>
                    <el-form
                        label-position="left"
                        label-width="5rem"
                        style="width: 100%"
                        @submit.native.prevent="save(model._id)"
                    >
                        <el-form-item label="博客名称">
                            <el-input
                                v-model="model.name"
                                autosize
                                placeholder="请输入内容"
                                style="max-width: 40rem"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="博客链接">
                            <el-input
                                v-model="model.link"
                                :rows="2"
                                autosize
                                placeholder="请输入内容"
                                style="max-width: 40rem"
                                type="textarea"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="博客简介">
                            <el-input
                                v-model="model.desc"
                                :rows="2"
                                autosize
                                placeholder="请输入内容"
                                style="max-width: 40rem"
                                type="textarea"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="博客头像">
                            <el-upload
                                :action="$http.defaults.baseURL + '/upload'"
                                :headers="getAuthHeaders()"
                                :on-success="(res) => $set(model, 'avatar', res.url)"
                                :show-file-list="false"
                                class="avatar-uploader"
                            >
                                <img v-if="model.avatar" :src="model.avatar" class="avatar"/>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item style="float: right">
                            <el-button @click="isDialog = false">取 消</el-button>
                            <el-button native-type="submit" type="primary">保存</el-button>
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
            linksList: [],
            currentPage: 1,
            pageSize: 5
        };
    },
    created() {
        this.fetch();
    },
    methods: {
        // 请求数据
        async fetch() {
            const res = await this.$http.get('rest/friendLinks'); // eslint-disable-line no-unused-vars
            this.linksList = res.data;
        },
        // 删除
        async remove(row) {
            this.$confirm(`是否确认删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    console.log(row);
                    await this.$http.delete(`rest/friendLinks/${row._id}/${undefined}`);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    await this.fetch();
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
                res = await this.$http.put(`rest/friendLinks/${id}`, this.model);
            } else {
                this.model.datetime = new Date();
                res = await this.$http.post('rest/friendLinks', this.model);
            }
            this.$message({
                type: 'success',
                message: '保存成功'
            });
            this.isDialog = false;
            this.isEdit = false;
            await this.fetch();
        },
        // 编辑
        async edit(id) {
            const { data: res } = await this.$http.get(`rest/friendLinks/${id}`); // eslint-disable-line no-unused-vars
            this.model = res;
            this.isDialog = true;
            this.isEdit = true;
        },
        isClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {
                });
        },
        newDialog() {
            this.model = {};
            this.isEdit = false;
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
        },
        handleCurrentChange: function(currentPage) {
            this.currentPage = currentPage;
        }
    }
};
</script>

<style scoped>
.avatar-uploader {
    width: 300px;
    height: 300px;
}
.avatar-uploader .avatar {
    width: 100%;
    height: 100%;
}
.avatar-uploader .avatar-uploader-icon {
    height: 300px;
    width: 300px;
    line-height: 300px;
}
</style>
