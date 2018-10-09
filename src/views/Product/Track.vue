<template>
    <div class="track">
        <div class="table_container">
            <div class="title">策略跟踪和策略应用</div>
            <el-table :data="tableData.slice((currentPage - 1) * 10, currentPage * 10)" stripe>
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
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="10"
                    layout="total, prev, pager, next, jumper"
                    :total="tableData.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
const tableData = [
{a: '品类', b: '产品成本', c:	'优', d: '供应商', e: '按品类梳理供应商结构，对供应商报价进行综合评估和管理', f:'10', g: '10', h: '100%'},
{a: '品类', b: '产品成本', c:	'优', d: '采购', e: '持续优化采购渠道', f:'8', g: '8', h: '100%'},
{a: '品类', b: '产品成本', c:	'良', d: '预算', e: '持续优化品类成本管控预算结构', f:'12', g: '12', h: '100%'},
{a: '品类', b: '产品成本', c:	'良', d: '供应商', e: '按品类梳理供应商结构，对供应商报价进行综合评估和管理', f:'10', g: '9', h: '90%'},
{a: '品类', b: '产品成本', c:	'良', d: '采购', e: '持续优化采购渠道', f:'8', g: '4', h: '50%'},
{a: '品类', b: '产品成本', c:	'中', d: '预算', e: '梳理现有品类成本预算结构', f:'20', g: '19', h: '95%'},
{a: '品类', b: '产品成本', c:	'中', d: '预算', e: '加强各环节成本预算管控', f:'6', g: '3', h: '50%'},
{a: '品类', b: '产品成本', c:	'中', d: '包装', e: '查验包装成本中高成本环节，对其进行评估、调整或删除', f:'7', g: '7', h: '100%'},
{a: '品类', b: '产品成本', c:	'中', d: '包装', e: '按预算整体控制包装成本', f:'16', g: '12', h: '75%'},
{a: '品类', b: '产品成本', c:	'中', d: '供应商', e: '寻找新的高性价比供应商资源', f:'6', g: '5', h: '83%'},
{a: '品类', b: '产品成本', c:	'中', d: '供应商', e: '建立供应商管理体系', f:'20', g: '19', h: '95%'},
{a: '品类', b: '产品成本', c:	'中', d: '供应商', e: '梳理品类供应商资源，根据不同的品类预算进行合理供应商资源配置', f:'20', g: '19', h: '95%'},
{a: '品类', b: '产品成本', c:	'中', d: '采购', e: '对高成本采购渠道或环节进行查验', f:'16', g: '12', h: '75%'},
{a: '品类', b: '产品成本', c:	'中', d: '采购', e: '寻找新的高性价比采购渠道', f:'21', g: '14', h: '67%'},
{a: '品类', b: '产品成本', c:	'中', d: '摄影', e: '查验摄影环节中高成本环节，对其进行评估调整', f:'16', g: '12', h: '75%'},
{a: '品类', b: '产品成本', c:	'差', d: '预算', e: '梳理现有品类整体成本预算结构', f:'20', g: '19', h: '95%'},
{a: '品类', b: '产品成本', c:	'差', d: '预算', e: '加强各环节成本预算管控', f:'15', g: '14', h: '93%'},
{a: '品类', b: '产品成本', c:	'差', d: '包装', e: '查验包装成本中高成本环节，对其进行评估、调整或删除', f:'15', g: '14', h: '93%'},
{a: '品类', b: '产品成本', c:	'差', d: '包装', e: '按预算整体控制包装成本', f:'30', g: '18', h: '60%'},
{a: '品类', b: '产品成本', c:	'差', d: '供应商', e: '按品类查验报价较高的供应商，对其进行评估与调整', f:'30', g: '18', h: '60%'},
{a: '品类', b: '产品成本', c:	'差', d: '采购', e: '对高成本采购渠道或环节进行查验', f:'21', g: '14', h: '67%'},
{a: '品类', b: '产品成本', c:	'差', d: '采购', e: '寻找新的高性价比采购渠道', f:'15', g: '14', h: '93%'},
{a: '品类', b: '产品成本', c:	'差', d: '摄影', e: '查验摄影环节中高成本环节，对其进行评估调整', f:'16', g: '12', h: '75%'},
{a: '品类', b: '日销', c:	'优', d: '流量', e: '精准流量引流', f:'21', g: '14', h: '67%'},
{a: '品类', b: '日销', c:	'优', d: '转化', e: '优化品类结构', f:'30', g: '18', h: '60%'},
{a: '品类', b: '日销', c:	'优', d: '转化', e: '优化品类生活方式/场景展现', f:'30', g: '18', h: '60%'},
{a: '品类', b: '日销', c:	'优', d: '转化', e: '优化商品运营', f:'20', g: '19', h: '95%'},
{a: '品类', b: '日销', c:	'优', d: '客单', e: '优化服务', f:'15', g: '14', h: '93%'},
{a: '品类', b: '日销', c:	'优', d: '客单', e: '优化视觉', f:'21', g: '14', h: '67%'},
{a: '品类', b: '日销', c:	'良', d: '流量', e: '精准流量引流', f:'30', g: '26', h: '87%'},
{a: '品类', b: '日销', c:	'良', d: '转化', e: '优化品类结构', f:'15', g: '14', h: '93%'},
{a: '品类', b: '日销', c:	'良', d: '转化', e: '优化品类生活方式/场景展现', f:'20', g: '19', h: '95%'},
{a: '品类', b: '日销', c:	'良', d: '转化', e: '优化商品运营', f:'30', g: '26', h: '87%'},
{a: '品类', b: '日销', c:	'良', d: '客单', e: '优化服务', f:'16', g: '12', h: '75%'},
{a: '品类', b: '日销', c:	'良', d: '客单', e: '优化视觉', f:'30', g: '18', h: '60%'},
{a: '品类', b: '日销', c:	'中', d: '流量', e: '调整品类价格分布', f:'20', g: '19', h: '95%'},
{a: '品类', b: '日销', c:	'中', d: '流量', e: '突出品类差异化展现', f:'15', g: '14', h: '93%'},
{a: '品类', b: '日销', c:	'中', d: '转化', e: '加强品类搭配', f:'30', g: '18', h: '60%'},
{a: '品类', b: '日销', c:	'中', d: '转化', e: '加强品类生活方式/场景表达', f:'30', g: '18', h: '60%'},
{a: '品类', b: '日销', c:	'中', d: '转化', e: '提升商品运营整体能力', f:'21', g: '14', h: '67%'},
{a: '品类', b: '日销', c:	'中', d: '客单', e: '加强场景引导', f:'20', g: '19', h: '95%'},
{a: '品类', b: '日销', c:	'中', d: '客单', e: '加强客服服务', f:'16', g: '12', h: '75%'},
{a: '品类', b: '日销', c:	'中', d: '客单', e: '加强关联销售与关联搭配', f:'30', g: '18', h: '60%'},
{a: '品类', b: '日销', c:	'差', d: '流量', e: '调整品类价格分布', f:'30', g: '26', h: '87%'},
{a: '品类', b: '日销', c:	'差', d: '流量', e: '突出品类差异化展现', f:'20', g: '19', h: '95%'},
{a: '品类', b: '日销', c:	'差', d: '转化', e: '加强品类搭配', f:'21', g: '14', h: '67%'},
{a: '品类', b: '日销', c:	'差', d: '转化', e: '加强品类生活方式/场景表达', f:'30', g: '26', h: '87%'},
{a: '品类', b: '日销', c:	'差', d: '转化', e: '提升商品运营整体能力', f:'30', g: '26', h: '87%'},
{a: '品类', b: '日销', c:	'差', d: '转化', e: '对销量转化极低的品类进行删除', f:'30', g: '18', h: '60%'},
{a: '品类', b: '日销', c:	'差', d: '客单', e: '加强场景引导', f:'21', g: '14', h: '67%'},
{a: '品类', b: '日销', c:	'差', d: '客单', e: '加强客服服务', f:'30', g: '26', h: '87%'},
{a: '品类', b: '日销', c:	'差', d: '客单', e: '加强关联销售与关联搭配', f:'30', g: '26', h: '87%'},
];
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
        handleCurrentChange(val) {
            this.currentPage = val;
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

