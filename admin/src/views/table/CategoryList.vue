<template>
    <div id="categoryList">
            <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <el-button type="primary" icon="el-icon-plus" @click="isDialog = true">新建</el-button>
            </div>
            <el-table :data="items.slice((currentPage - 1) * pagesize, currentPage * pagesize)" border >
                <el-table-column type="index" label="ID" width="50" align="center"></el-table-column>
                <el-table-column prop="_id" label="数据库ID" width="250"></el-table-column>
                <el-table-column prop="name" label="分类名称" width="150" align="center"></el-table-column>
                <el-table-column prop="name" label="子分类" >
                    <template slot-scope="scope">
                        <el-tag v-for="(item, index) in scope.row.children" :key="index">{{item.name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="修改时间"  width="200" align="center">
                    <template scope="scope">
                        {{ scope.row.datetime | playTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column flexd="right" label="操作" width="180" align="center">
                    <template slot-scope="scope" >
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
                :total="items.length"
                :current-page="currentPage"
                :page-sizes="[1, 5, 10]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </el-card>
        
        <!-- 新建分类 -->
        <el-dialog :visible.sync="isDialog" @closed="newDialog" :before-close="isClose">
            <el-card style="border-radius: 0; margin: 0;">
                <div slot="header" class="clearfix">
                    <span class="dialog-title">{{ isEdit ? '编辑' : '新建' }}分类</span>
                    <span class="add-item">
                        <el-button class="el-icon-circle-plus-outline" type="info" plain size="small" @click="newBuilt"
                            >添加子分类</el-button
                        >
                    </span>
                </div>
                <el-form label-width="4.5rem" @submit.native.prevent="save(model._id)" label-position="left">
                    <el-form-item style="" label="名称:">
                        <el-input v-model="model.name" placeholder=""></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :md="12" v-for="item in model.children" :key="item.id">
                            <el-form-item :label="`子分类${item.num}:`">
                                <el-col :md="22">
                                    <el-input v-model="item.name" placeholder="">
                                        <!-- <el-button @click="del(item.num)" slot="append" icon="el-icon-delete"></el-button> -->
                                    </el-input>
                                </el-col>
                                <el-col :md="2">
                                    <span class="el-icon-close close-btn" @click="del(item.num)" ></span>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item style="float: right;">
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
            items: [],
            isDialog: false,
            model: {
                children: []
            },
            num: 0,
            count: [],
            isEdit: false,
            currentPage: 1,
            pagesize: 5
        };
    },
    created() {
        this.fetch();
    },
    methods: {
        // 请求分类数据
        async fetch() {
            const res = await this.$http.get('rest/categories'); // eslint-disable-line no-unused-vars
            this.items = res.data;
        },
        // 删除分类
        async remove(row) {
            this.$confirm(`是否要删除分类"${row.name}"?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    await this.$http.delete(`rest/categories/${row._id}/${undefined}`);
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
        // 新建分类名称
        async save(id) {
            let res; // eslint-disable-line no-unused-vars
            this.model.datetime = new Date();
            if (id) {
                res = await this.$http.put(`rest/categories/${id}`, this.model);
            } else {
                res = await this.$http.post('rest/categories', this.model);
            }
            this.$message({
                type: 'success',
                message: '保存成功'
            });
            this.isDialog = false;
            this.isEdit = false;
            this.fetch();
        },
        isClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        newDialog() {
            this.model.children = [];
            this.model.name = '';
            this.isEdit = false;
            this.num = 0;
        },
        // 新建子分类
        newBuilt() {
            this.model.children.push({
                num: (this.num += 1),
                name: ''
            });
        },
        // 删除子分类
        del(value) {
            this.model.children.splice(value - 1, 1);
            this.num -= 1;
            this.model.children.forEach((item, index) => {
                item.num = index + 1;
            });
        },
        async edit(id) {
            const { data: res } = await this.$http.get(`rest/categories/${id}`); // eslint-disable-line no-unused-vars
            this.model = res;
            console.log(this.model);
            this.num = this.model.children.length;
            this.isEdit = true;
            this.isDialog = true;
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
.demn-table-expand {
    font-size: 0;
}
.demn-table-expand label {
    width: 5rem;
    color: #99a9bf;
}
.demn-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
}

.add-item {
    float: right;
}
</style>
