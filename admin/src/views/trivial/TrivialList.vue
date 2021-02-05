<template>
    <div id="trivialList">
        <el-card shadow="hover">
        <div slot="header" class="clearfix">
            <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
        </div>
        <el-table
            :data="trivials.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
            border
            :default-sort = "{prop: 'datetime', order: 'ascending'}"
        >
            <el-table-column label="创建时间"  sortable align="center" width="200"  prop="datetime">
                <template scope="scope">
                    {{ scope.row.datetime | playTimeFormat }}
                </template>
            </el-table-column>
            <el-table-column label="内容" header-align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.content }}</span>
                </template>
            </el-table-column>
            <el-table-column flexd="right" label="操作" width="180" align="center">
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
            style="margin-top: .625rem"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="trivials.length"
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
                    <span class="dialog-title">{{ isEdit ? '编辑' : '新建' }}日常</span>
                </div>
                <el-form
                    label-width="3rem"
                    style="width:100%"
                    label-position="left"
                    @submit.native.prevent="save(model._id)"
                >
                    <el-form-item label="内容">
                        <el-input
                            type="textarea"
                            style="max-width: 40rem"
                            autosize
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="model.content"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="照片">
                        <el-upload
                            class="avatar-uploader"
                            :action="$http.defaults.baseURL + '/upload'"
                            :show-file-list="false"
                            :headers="getAuthHeaders()"
                            :on-success="res => $set(model, 'image', res.url)"
                        >
                            <img v-if="model.image" :src="model.image" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
            trivials: [],
            currentPage: 1,
            pagesize: 5
        };
    },
    created() {
        this.fetch();
    },
    methods: {
        // 请求数据
        async fetch() {
            const res = await this.$http.get('rest/trivials'); // eslint-disable-line no-unused-vars
            this.trivials = res.data;
        },
        // 删除
        async remove(row) {
            this.$confirm(`是否确认删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    await this.$http.delete(`rest/trivials/${row._id}`);
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
                res = await this.$http.put(`rest/trivials/${id}`, this.model);
            } else {
                this.model.datetime = new Date();
                res = await this.$http.post('rest/trivials', this.model);
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
            const { data: res } = await this.$http.get(`rest/trivials/${id}`); // eslint-disable-line no-unused-vars
            this.model = res;
            this.isDialog = true;
            this.isEdit = true;
        },
        isClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        newDialog() {
            this.model = {};
            this.isEdit = false;
        },
        handleSizeChange: function(val) {
            this.pagesize = val;
        },
        handleCurrentChange: function(currentPage) {
            this.currentPage = currentPage;
        },
      
    }
};
</script>

<style scoped>
.avatar-uploader {
    position: relative;
    width: 100%;
}

.avatar {
    width: 100%;
    height: 100%;
}
</style>
