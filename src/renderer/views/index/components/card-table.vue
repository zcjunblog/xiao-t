<template>
    <div class="card-table">
        <div class="card-table__header">
            <span>门店销售额排名</span>
        </div>
        <div class="card-table__container">
            <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%"
            >
                <el-table-column
                        label="日期"
                        width="180"
                        align="center"
                >
                    <template #default="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="姓名"
                        width="180"
                        align="center"
                >
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p>姓名: {{ scope.row.name }}</p>
                                <p>住址: {{ scope.row.address }}</p>
                            </template>
                            <template #reference>
                                <div class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="right">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex">
                <div class="flex1"></div>
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </el-row>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentPage: 4,
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }
                ]
            };
        },

        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .card-table {
        height: 560px;
        .el-row{
            margin-top: 7px;
        }
        &__header {
            display: flex;
            align-items: center;
            height: 50px;
            font-size: 15px;
            font-weight: bold;
            color: #333333;
            padding: 0 20px;
        }

        &__container {
            padding: 0 20px;
        }

        &__filter {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;

            ul {
                display: flex;
                flex: 1;
                margin-right: 10px;

                li {
                    list-style: none;
                    font-size: 14px;
                    flex: 1;
                    cursor: pointer;
                    color: #d8d8d8;

                    &.active {
                        color: #333333;
                    }

                    &:not(.active):hover {
                        color: #999;
                    }
                }
            }
        }

        &__list {
            height: 260px;

            li {
                display: flex;
                align-items: center;
                height: 52px;
                list-style: none;
                font-size: 13px;
                cursor: pointer;

                span {
                    &:first-child {
                        display: inline-block;
                        height: 14px;
                        width: 14px;
                        border-radius: 14px;
                        text-align: center;
                        line-height: 14px;
                        font-size: 12px;
                    }

                    &:nth-child(2) {
                        flex: 1;
                        margin: 0 10px;
                        letter-spacing: 0.5px;
                        color: #222;
                    }
                }

                &:nth-last-child(n + 3) {
                    span {
                        &:first-child {
                            background-color: #333333;
                            color: #fff;
                        }
                    }
                }

                &:hover {
                    span:nth-child(2) {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>
