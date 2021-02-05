<template>
    <div id="ArticlesList">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
            </div>
            <el-table :data="articles.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border>
                <el-table-column prop="_id" label="ID" width="220"></el-table-column>
                <el-table-column prop="title" label="文章名称" align="center"></el-table-column>
                <el-table-column prop="icon" label="封面" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon" style="height: 7.5rem; border-radius: 5%" alt="" />
                    </template>
                </el-table-column>
                <el-table-column label="文章类型">
                    <template slot-scope="scope">
                        <el-tag v-for="(item, index) in scope.row.categories" :key="index">{{ item.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="阅读量" align="center" prop="views">
                </el-table-column>
                <el-table-column label="编辑时间" align="center">
                    <template scope="scope">
                        {{ scope.row.datetime | playTimeFormat }}
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
                :total="articles.length"
                :current-page="currentPage"
                :page-sizes="[1, 5, 10]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </el-card>
        <!--     <div v-if="articles.length != 0" class="markdown-body" v-html="articles[0].content">
            {{ articles[0].content }}
        </div> -->
        <!-- 新建文章 -->
        <el-dialog
            :visible.sync="isDialog"
            destroy-on-close
            :before-close="isClose"
            @closed="newDialog"
            width="72rem"
            top=".125rem"
        >
            <el-card style="border-radius: 0; margin: 0">
                <div slot="header" class="clearfix">
                    <span class="dialog-title">{{ isEdit ? '编辑' : '新建' }}文章</span>
                </div>
                <el-form label-width="3rem" label-position="left" @submit.native.prevent="save(model._id)">
                    <el-form-item label="标题">
                        <el-input v-model="model.title"></el-input>
                    </el-form-item>
                    <el-form-item label="简介">
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="model.brief"> </el-input>
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select v-model="model.categories" multiple value-key="name" placeholder="请选择" style="width: 20rem">
                            <el-option
                                v-for="item of categories"
                                :key="item._id"
                                :label="item.name"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="封面">
                        <el-upload
                            class="avatar-uploader"
                            :action="$http.defaults.baseURL + '/upload'"
                            :headers="getAuthHeaders()"
                            :show-file-list="false"
                            :on-success="res => $set(model, 'icon', res.url)"
                        >
                            <img v-if="model.icon" :src="model.icon" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="详情">
                        <mavon-editor
                            ref="md"
                            v-model="model.mdtext"
                            codeStyle="atom-one-dark"
                            @imgAdd="$imgAdd"
                        ></mavon-editor>
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button @click="isDialog = false">取 消</el-button>
                        <el-button type="primary" native-type="submit">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            articles: [],
            isDialog: false,
            isEdit: false,
            model: {},
            categories: [],
            currentPage: 1,
            pagesize: 5
        };
    },
    components: {},
    created() {
        this.fetch();
        this.fetchCategories();
    },
    mounted() {},
    methods: {
        // 请求分类数据
        async fetch() {
            const res = await this.$http.get('rest/articles'); // eslint-disable-line no-unused-vars
            this.articles = res.data;
        },
        // 删除文章
        async remove(row) {
            this.$confirm(`是否要删除文章"${row.title}"?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    await this.$http.delete(`rest/articles/${row._id}`);
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
        // 新建文章
        async save(id) {
            let res; // eslint-disable-line no-unused-vars
            this.model.datetime = new Date();
            this.model.content = this.$refs.md.d_render;
            this.model.views = 1;
            if (id) {
                res = await this.$http.put(`rest/articles/${id}`, this.model);
            } else {
                res = await this.$http.post('rest/articles', this.model);
            }
            this.$message({
                type: 'success',
                message: '保存成功'
            });
            this.isDialog = false;
            this.isEdit = false;
            this.fetch();
        },
        // 编辑获取文章
        async edit(id) {
            const { data: res } = await this.$http.get(`rest/articles/${id}`); // eslint-disable-line no-unused-vars
            this.model = res;
            this.isDialog = true;
            this.isEdit = true;
        },
        // 获取分类列表
        async fetchCategories() {
            const { data: res } = await this.$http.get(`rest/categories`); // eslint-disable-line no-unused-vars
            this.categories = res.find(key => key.name === '文章标签').children;
        },
        async $imgAdd(pos, $file) {
            // 第一步.将图片上传到服务器.
            const formdata = new FormData();
            formdata.append('file', $file);
            const res = await this.$http.post('upload', formdata);
            this.$refs.md.$img2Url(pos, res.data.url);
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

<style>

</style>
