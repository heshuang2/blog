<template>
    <div id="messageList">
        <el-card shadow="hover">
            <!--  <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
            </div> -->
            <el-table
                :data="messages.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                @sort-change="sortChange"
            >
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
                <el-table-column label="创建时间" sortable="custom" align="center" width="200" prop="datetime">
                    <template scope="scope">
                        {{ scope.row.datetime | playTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="昵称" align="center" width="200">
                    <template slot-scope="scope">
                        <el-tag
                            :effect="scope.row.children ? 'light' : 'dark'"
                            :type="scope.row.children ? 'success' : ''"
                            :size="scope.row.children ? '' : 'small'"
                            >{{ scope.row.user.name }}</el-tag
                        >
                    </template>
                </el-table-column>
                <el-table-column label="头像" align="center" width="200">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.user.avatar"  fit="fit"></el-image>
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
                :total="messages.length"
                :current-page="currentPage"
                :page-sizes="[1, 5, 10]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
            <!-- 新建日常 -->
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
            const { data: res } = await this.$http.get('rest/messages'); // eslint-disable-line no-unused-vars
            this.messages = res.data;
            this.messages.sort((a, b) => (a.datetime < b.datetime ? 1 : -1));
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
                    await this.$http.delete(`rest/messages/${row._id}/${row.infoId}`);
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
        async edit(id, row) {
            console.log(row);
            const { data: res } = await this.$http.get(`rest/messages/${id}`); // eslint-disable-line no-unused-vars
            /*  console.log(res);
           this.model = res.data;
            this.isDialog = true;
            this.isEdit = true;
            console.log(this.model); */
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
        sortChange(column) {
            this.pageIndex = 1; // 排序后返回第一页
            if (column.order === 'descending') {
                this.messages.sort((a, b) => (b[column.prop] - a[column.prop] ? 1 : -1));
            } else if (column.order === 'ascending') {
                this.messages.sort((a, b) => (a[column.prop] - b[column.prop] ? 1 : -1));
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
.el-image >>> .el-image__inner {
    height: 60px;
    width: 60px;
    object-fit: cover;
    border-radius: 50%;
}

</style>
