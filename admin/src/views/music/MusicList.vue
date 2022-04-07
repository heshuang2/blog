<template>
    <div id="musicList">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
            </div>
            <el-table
                :data="musicList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                :default-sort="{ prop: 'datetime', order: 'ascending' }"
                border
            >
                <el-table-column align="center" label="id" sortable width="200">
                    <template scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="歌曲" align="center" width="200">
                    <template scope="scope">
                        <el-tag effect="dark">
                            {{scope.row.name }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="artist" label="歌手" align="center" width="200">
                    <template scope="scope">
                        <el-tag  type="danger">
                            {{scope.row.artist }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" label="歌曲url">
                    <template slot-scope="scope">
                        <span>{{ scope.row.url }}</span>
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
                :total="musicList.length"
                layout="total, sizes, prev, pager, next, jumper"
                style="margin-top: 0.625rem"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
            <!-- 新建日常 -->
            <el-dialog :visible.sync="isDialog" destroy-on-close :before-close="isClose" @closed="newDialog">
                <el-card style="border-radius: 0; margin: 0">
                    <div slot="header" class="clearfix">
                        <span class="dialog-title">{{ isEdit ? '编辑' : '新建' }}音乐</span>
                    </div>
                    <el-form
                        label-width="3rem"
                        style="width: 100%"
                        label-position="left"
                        @submit.native.prevent="save(model._id)"
                    >
                        <el-form-item label="id">
                            <el-input
                                type="textarea"
                                style="max-width: 40rem"
                                autosize
                                :rows="2"
                                placeholder="请输入id"
                                v-model="model.id"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="音乐">
                            <el-input
                                type="textarea"
                                style="max-width: 40rem"
                                autosize
                                :rows="2"
                                placeholder="请输入音乐"
                                v-model="model.name"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="歌手">
                            <el-input
                                type="textarea"
                                style="max-width: 40rem"
                                autosize
                                :rows="2"
                                placeholder="请输入歌手"
                                v-model="model.artist"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="链接">
                            <el-input
                                type="textarea"
                                style="max-width: 40rem"
                                autosize
                                :rows="2"
                                placeholder="请输入链接"
                                v-model="model.url"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="封面">
                            <el-upload
                                class="avatar-uploader"
                                :action="$http.defaults.baseURL + '/upload'"
                                :show-file-list="false"
                                :headers="getAuthHeaders()"
                                :on-success="(res) => $set(model, 'cover', res.url)"
                            >
                                <img v-if="model.cover" :src="model.cover" class="avatar"/>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="歌词">
                            <el-input
                                type="textarea"
                                style="max-width: 40rem"
                                autosize
                                :rows="2"
                                v-model="model.lrc"
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
    name: 'MusicList',
    data() {
        return {
            isDialog: false,
            isEdit: false,
            model: {},
            musicList: [],
            currentPage: 1,
            pageSize: 5
        };
    },
    mounted() {
        this.getMusicList();
    },
    methods: {
        async getMusicList() {
            const {data} = await this.$http.get('rest/music');
            console.log(data);
            this.musicList = data;
        },
        // 新建
        async save(id) {
            let res; // eslint-disable-line no-unused-vars
            if (id) {
                res = await this.$http.put(`rest/music/${id}`, this.model);
            } else {
                this.model.datetime = new Date();
                res = await this.$http.post('rest/music', this.model);
            }
            this.$message({
                type: 'success',
                message: '保存成功'
            });
            this.isDialog = false;
            this.isEdit = false;
            this.getMusicList();
        },
        // 编辑
        async edit(id) {
            const { data: res } = await this.$http.get(`rest/music/${id}`); // eslint-disable-line no-unused-vars
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
    width: 200px;
    height: 200px;
}
.avatar-uploader .el-upload img {
    width: 200px;
    height: 200px;
    object-fit: cover;
}
.avatar-uploader .avatar-uploader-icon {
    height: 200px;
    width: 200px;
    line-height: 200px;
}
</style>