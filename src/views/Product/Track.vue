<template>
    <div class="track">
        <div class="table_container">
            <div class="title">策略跟踪和策略应用</div>
            <el-table :data="tableData" stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="a" label="产品层级" :filters="[{text: '品牌', value: '品牌'}]" :filter-method="filterA"></el-table-column>
                <el-table-column prop="b" label="指标" :filters="[{text: '产品成本额', value: '产品成本额'}]" :filter-method="filterB"></el-table-column>
                <el-table-column prop="c" label="评选等级" :filters="[{text: '差', value: '差'}]" :filter-method="filterC"></el-table-column>
                <el-table-column prop="d" label="影响因素" :filters="[{text: '供应商', value: '供应商'}]" :filter-method="filterD"></el-table-column>
                <el-table-column prop="e" label="策略"></el-table-column>
                <el-table-column prop="f" label="采纳次数" :filters="[{text: '4', value: '4'},{text: '3', value: '3'},{text: '2', value: '2'},{text: '1', value: '1'}]" :filter-method="filterF"></el-table-column>
                <el-table-column prop="g" label="有效次数" :filters="[{text: '4', value: '4'},{text: '3', value: '3'},{text: '2', value: '2'},{text: '1', value: '1'}]" :filter-method="filterG"></el-table-column>
                <el-table-column prop="h" label="策略准确度/适用度" :filters="[{text: '100%', value: '100%'}]" :filter-method="filterH"></el-table-column>
            </el-table>
            <div class="page_container">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
const tableData = Array(10).fill({
                a: '品牌',
                b: '产品成本额',
                c: '差',
                d: '供应商',
                e: '寻找性价比更高的供应商',
                f: '4',
                g: '4',
                h: '100%'
            });
export default {
    components: {
    },
    data() {
        return {
            currentPage: 1,
            tableData: tableData
        }
    },
    watch: {

    },
    methods: {
        filterA(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterB(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterC(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterD(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterF(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterG(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        filterH(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        handleSizeChange(val) {
        },
        handleCurrentChange(val) {
        }
    }
}
</script>

<style lang="scss">
.track {
    min-width: 1024px;
    height: 100%;
    .table_container {
        border-radius: 5px;
        background: #fff;
        padding: 20px 0;
    }
    .title {
        margin: 0 0 25px 25px;
    }
    .el-table {
        .el-table__row {
            > td {
                background: #EEE;
            }
        }
        thead {
            color: #323232;
        }
        .el-table_1_column_1 {
            text-align: center;
        }
        .el-table__column-filter-trigger {
            width: 25px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            border-radius: 3px;
            background: #208cb2;
            margin-left: 5px;
        }
        .el-table__column-filter-trigger i {
            transform: scale(1.2);
            font-weight: bold;
            color: #fff;
        }
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background: #fff;
    }
    .page_container {
        text-align: center;
        margin: 40px 0 20px;
    }
}
</style>

