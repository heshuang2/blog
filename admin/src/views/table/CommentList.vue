<template>
    <div id="commentList">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
            </div>
            <el-table
                :data="comments.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                border
                :default-sort="{ prop: 'datetime', order: 'ascending' }"
            >
                <el-table-column label="创建时间" sortable align="center" width="200" prop="datetime">
                    <template scope="scope">
                        {{ scope.row.datetime | playTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="文章" width="300" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span style="color: red">{{ scope.row.article.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-tag type="success">{{ scope.row.user.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="内容" header-align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.message }}</span>
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
                style="margin-top: 0.625rem"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="comments.length"
                :current-page="currentPage"
                :page-sizes="[1, 5, 10]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
            <!-- 新建评论 -->
            <el-dialog :visible.sync="isDialog" destroy-on-close :before-close="isClose" @closed="newDialog">
                <el-card style="border-radius: 0; margin: 0">
                    <div slot="header" class="clearfix">
                        <span class="dialog-title">{{ isEdit ? '编辑' : '新建' }}评论</span>
                    </div>
                    <el-form label-width="3rem" label-position="left" @submit.native.prevent="save(model._id)">
                        <el-form-item label="文章">
                            <el-select
                                v-model="model.article"
                                value-key="name"
                                placeholder="请选择"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="item of articles"
                                    :key="item._id"
                                    :label="item.title"
                                    :value="item"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <el-input placeholder="请输入内容" v-model="model.name"> </el-input>
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
                        <el-form-item label="回复" v-for="(item, index) in model.children" :key="index">
                            <el-tag style="width: 18%" effect="plain">{{ item.name }}</el-tag>
                            <el-input
                                type="textarea"
                                style="width: 80%; float: right"
                                autosize
                                placeholder="请输入内容"
                                v-model="item.content"
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
            articles: [],
            comments: [],
            currentPage: 1,
            pagesize: 5
        };
    },
    created() {
        this.fetch();
        this.fetchArticles();
    },
    methods: {
        // 请求数据
        async fetch() {
            const res = await this.$http.get('rest/comments'); // eslint-disable-line no-unused-vars
            console.log(res.data);
            this.comments = res.data;
        },
        // 删除
        async remove(row) {
            this.$confirm(`是否确认删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    await this.$http.delete(`rest/comments/${row._id}`);
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
                res = await this.$http.put(`rest/comments/${id}`, this.model);
            } else {
                this.model.datetime = new Date();
                res = await this.$http.post('rest/comments', this.model);
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
            const { data: res } = await this.$http.get(`rest/comments/${id}`); // eslint-disable-line no-unused-vars
            this.model = res;
            this.isDialog = true;
            this.isEdit = true;
        },
        // 获取文章列表
        async fetchArticles() {
            const { data: res } = await this.$http.get(`rest/articles`); // eslint-disable-line no-unused-vars
            this.articles = Array.from(res, ({ _id, title }) => {
                return { _id, title };
            });
            // console.log(this.articles);
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
