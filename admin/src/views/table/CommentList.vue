<template>
    <div id="commentList">
        <el-card shadow="hover">
            <el-collapse accordion>
                <el-collapse-item v-for="(item, index) in articles" :name="index" :key="index">
                    <template slot="title" class="article-card"
                        ><h3>{{ item.title }}</h3>
                        <i class="header-icon el-icon-info"></i>
                    </template>
                    <el-table
                        :data="item.item.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                        @sort-change="sortChange"
                    >
                        <!-- 回复数据-->
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-card>
                                    <el-table :data="props.row.children">
                                    <el-table-column
                                        label="创建时间"
                                        sortable
                                        align="center"
                                        width="200"
                                        prop="datetime"
                                    >
                                        <template scope="scope">
                                            {{ scope.row.datetime | playTimeFormat }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="头像"
                                        width="150"
                                        align="center"
                                        :show-overflow-tooltip="true"
                                    >
                                        <template slot-scope="scope">
                                            <el-image :src="scope.row.user.avatar" fit="fit"></el-image>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="昵称" align="center" width="200px">
                                        <template slot-scope="scope">
                                            <el-tag
                                                :effect="scope.row.children ? 'light' : 'dark'"
                                                :type="scope.row.children ? 'success' : ''"
                                                :size="scope.row.children ? '' : 'small'"
                                                >{{ scope.row.user.name }}</el-tag
                                            >
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="回复" width="100" align="center">
                                        <template slot-scope="scope">
                                            <el-tag type="info">{{ scope.row.userInfo.name }}</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="内容" align="center" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.message }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column flexd="right" label="操作" width="180" align="center">
                                        <template slot-scope="scope">
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
                                </el-card>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" sortable align="center" width="200" prop="datetime">
                            <template scope="scope">
                                {{ scope.row.datetime | playTimeFormat }}
                            </template>
                        </el-table-column>
                        <el-table-column label="头像" width="150" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-image :src="scope.row.user.avatar" fit="fit"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column label="昵称" align="center" width="200px">
                            <template slot-scope="scope">
                                <el-tag
                                    :effect="scope.row.children ? 'light' : 'dark'"
                                    :type="scope.row.children ? 'success' : ''"
                                    :size="scope.row.children ? '' : 'small'"
                                    >{{ scope.row.user.name }}</el-tag
                                >
                            </template>
                        </el-table-column>
                        <el-table-column label="内容" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.message }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="回复数" width="100" align="center">
                            <template slot-scope="scope">
                                <el-tag type="info" v-if="scope.row.children">{{ scope.row.children.length }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column flexd="right" label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <!-- <el-button
                                    @click="edit(scope.row._id)"
                                    type="primary"
                                    icon="el-icon-edit"
                                    circle
                                    size="small"
                                ></el-button> -->
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
                </el-collapse-item>
            </el-collapse>

            <!-- <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
            </div> -->
            <!--  <el-table
                :data="comments.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                border  row-key="_id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                @sort-change="sortChange"
            >
                <el-table-column label="创建时间" sortable align="center" width="200" prop="datetime">
                    <template scope="scope">
                        {{ scope.row.datetime | playTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column  label="文章" width="300" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope" v-if="scope.row.article">
                        <span style="color: red">{{ scope.row.article.title }}</span>
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
            </el-pagination> -->
            <!-- 新建评论 -->
            <!-- <el-dialog :visible.sync="isDialog" destroy-on-close :before-close="isClose" @closed="newDialog">
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
            </el-dialog> -->
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
            const { data: res1 } = await this.$http.get(`rest/articles`); // eslint-disable-line no-unused-vars
            this.articles = Array.from(res1, ({ _id, title }) => {
                return { _id, title };
            });
            this.articles.forEach((item) => (item.item = []));
            console.log(this.articles);
            const res2 = await this.$http.get('rest/comments'); // eslint-disable-line no-unused-vars
            console.log(res2.data.data);
            this.comments = res2.data.data;
            this.comments.forEach((element) => {
                this.articles.forEach((item) => {
                    if (element.article._id === item._id) {
                        item.item.push(element);
                    }
                });
            });
            console.log(this.articles);
        },
        // 删除
        async remove(row) {
            this.$confirm(`是否确认删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    await this.$http.delete(`rest/comments/${row._id}/${undefined}`);
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
        /*  async save(id) {
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
        }, */
        // 编辑
        async edit(id) {
            const { data: res } = await this.$http.get(`rest/comments/${id}`); // eslint-disable-line no-unused-vars
            this.model = res;
            this.isDialog = true;
            this.isEdit = true;
        },
        // 获取文章列表
        async fetchArticles() {},
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
        sortChange(column) {
            this.pageIndex = 1; // 排序后返回第一页
            if (column.order === 'descending') {
                this.comments.sort((a, b) => (b[column.prop] - a[column.prop] ? 1 : -1));
            } else if (column.order === 'ascending') {
                this.comments.sort((a, b) => (a[column.prop] - b[column.prop] ? 1 : -1));
            }
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
.el-collapse-item >>>.el-collapse-item__header{
    padding:  35px 0;
}
.el-image >>> .el-image__inner {
    height: 60px;
    width: 60px;
    object-fit: cover;
    border-radius: 50%;
}
</style>
