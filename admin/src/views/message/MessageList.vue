<template>
    <div id="messageList">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
            </div>
            <el-table
                :data="messages.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                border
                :default-sort="{ prop: 'datetime', order: 'ascending' }"
            >
                <el-table-column label="创建时间" sortable align="center" width="200" prop="datetime">
                    <template scope="scope">
                        {{ scope.row.datetime | playTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="昵称" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-tag type="success">{{ scope.row.name }}</el-tag>
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
                :total="messages.length"
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
                        
                        label-position="left"
                        @submit.native.prevent="save(model._id)"
                    >
                        <el-form-item label="昵称">
                            <el-input
                                placeholder="请输入内容"
                                v-model="model.name"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input
                                type="textarea"
                                autosize
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="model.content"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="回复">
                            <el-input
                                type="textarea"
                                autosize
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="model.content"
                            >
                            </el-input>
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
            messages: [],
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
            const res = await this.$http.get('rest/messages'); // eslint-disable-line no-unused-vars
            this.messages = res.data;
            console.log(this.messages);
        },
        // 删除
        async remove(row) {
            this.$confirm(`是否确认删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    await this.$http.delete(`rest/messages/${row._id}`);
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
                res = await this.$http.put(`rest/messages/${id}`, this.model);
            } else {
                this.model.datetime = new Date();
                res = await this.$http.post('rest/messages', this.model);
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
            const { data: res } = await this.$http.get(`rest/messages/${id}`); // eslint-disable-line no-unused-vars
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
        }
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
