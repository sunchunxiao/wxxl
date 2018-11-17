
//产品效率
const pieProduce = [{
    progress: 1.03,
    real: 1510734926,
    subject_name: 'sku数量',
    target: 1480520227.48
},{
    progress: 1.02,
    real: 14357015204,
    subject_name: '单品平均销售额',
    target: 13926304747.88
},{
    progress: 1.27,
    real: 12846280278,
    subject_name: '单品平均毛利润额',
    target: 13926304747.88
},{
    progress: 0.98,
    real: 0.1176,
    subject_name: '单品平均成本费用',
    target: 76.17
},{
    progress: 1.09,
    real: 82.79,
    subject_name: '单品平均库存额',
    target: 76.17
},{
    progress: 1.03,
    real: 94454047,
    subject_name: '单品平均日销',
    target: 68006913.84
},{
    progress: 0.84,
    real: 3278360349,
    subject_name: '平均投入产出比',
    target: 3901248815.31
}];

//渠道效率
const pieData = [{
    progress: 1.03,
    real: 1510734926,
    subject_name: '店铺数量',
    target: 1480520227.48
},{
    progress: 1.02,
    real: 14357015204,
    subject_name: '单店平均销售额',
    target: 13926304747.88
},{
    progress: 1.27,
    real: 12846280278,
    subject_name: '单店平均营业利润',
    target: 13926304747.88
},{
    progress: 0.98,
    real: 0.1176,
    subject_name: '单店平均成本费用',
    target: 76.17
},{
    progress: 1.09,
    real: 82.79,
    subject_name: '单店平均冗余值',
    target: 76.17
},{
    progress: 1.03,
    real: 94454047,
    subject_name: '单店平均日销',
    target: 68006913.84
},{
    progress: 0.84,
    real: 3278360349,
    subject_name: '平均投入产出比',
    target: 3901248815.31
}];

//客户效率
const pieDataCustomer = [{
    progress: 1.03,
    real: 1510734926,
    subject_name: '消费者数量',
    target: 1480520227.48
},{
    progress: 1.02,
    real: 14357015204,
    subject_name: '消费者人均销售额',
    target: 13926304747.88
},{
    progress: 1.27,
    real: 12846280278,
    subject_name: '人均客户利润额',
    target: 13926304747.88
},{
    progress: 0.98,
    real: 0.1176,
    subject_name: '消费者人均成本费用',
    target: 76.17
},{
    progress: 1.09,
    real: 82.79,
    subject_name: '消费者冗余值',
    target: 76.17
},{
    progress: 1.03,
    real: 94454047,
    subject_name: '消费者人均日销',
    target: 68006913.84
},{
    progress: 0.84,
    real: 3278360349,
    subject_name: '人均投入产出比',
    target: 3901248815.31
}];

//组织效率
const pieDataOrganization = [{
    progress: 1.03,
    real: 1510734926,
    subject_name: '企业人数',
    target: 1480520227.48
},{
    progress: 1.02,
    real: 14357015204,
    subject_name: '企业人均销售额',
    target: 13926304747.88
},{
    progress: 1.27,
    real: 12846280278,
    subject_name: '企业人均利润额',
    target: 13926304747.88
},{
    progress: 0.98,
    real: 0.1176,
    subject_name: '人均成本费用',
    target: 76.17
},{
    progress: 1.09,
    real: 82.79,
    subject_name: '企业人员冗余值',
    target: 76.17
},{
    progress: 1.03,
    real: 94454047,
    subject_name: '企业人均日销',
    target: 68006913.84
},{
    progress: 0.84,
    real: 3278360349,
    subject_name: '人均投入产出比',
    target: 3901248815.31
}];

//资金效率
const pieDataFund = [{
    progress: 1.03,
    real: 1510734926,
    subject_name: '净利润额',
    target: 1480520227.48
},{
    progress: 1.02,
    real: 14357015204,
    subject_name: '销售额',
    target: 13926304747.88
},{
    progress: 1.27,
    real: 12846280278,
    subject_name: '净现金流',
    target: 13926304747.88
},{
    progress: 0.98,
    real: 0.1176,
    subject_name: '总成本费用额',
    target: 76.17
},{
    progress: 1.09,
    real: 82.79,
    subject_name: '回款',
    target: 76.17
},{
    progress: 1.03,
    real: 94454047,
    subject_name: '净利率',
    target: 68006913.84
},{
    progress: 0.84,
    real: 3278360349,
    subject_name: '投资回报率',
    target: 3901248815.31
}];

const pieDataProduce = function mockPieproduce1() {
    let arr1 = _.cloneDeep(pieProduce);
    for(let i = 0; i < 7; i++) {
        // arr[i].value = Math.floor(Math.random() * 250) + 1;
        arr1[i].goal = Math.floor(Math.random() * 250) + 1;
        // [0.5 - 2] => [5 - 20] / 10
        let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
        arr1[i].value = Math.floor(arr1[i].goal * multiple);
    }
    return arr1;
};
//渠道
const pieChannel = function mockPieData2() {
    let arr = _.cloneDeep(pieData);
    for(let i = 0; i < 7; i++) {
        // arr[i].value = Math.floor(Math.random() * 250) + 1;
        arr[i].goal = Math.floor(Math.random() * 250) + 1;
        // [0.5 - 2] => [5 - 20] / 10
        let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
        arr[i].value = Math.floor(arr[i].goal * multiple);
    }
    return arr;
};
//客户
const pieCustomer = function mockPieData3() {
    let arr = _.cloneDeep(pieDataCustomer);
    for(let i = 0; i < 7; i++) {
        // arr[i].value = Math.floor(Math.random() * 250) + 1;
        arr[i].goal = Math.floor(Math.random() * 250) + 1;
        // [0.5 - 2] => [5 - 20] / 10
        let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
        arr[i].value = Math.floor(arr[i].goal * multiple);
    }
    return arr;
};
//组织
const pieOrganization = function mockPieData4() {
    let arr = _.cloneDeep(pieDataOrganization);
    for(let i = 0; i < 7; i++) {
        // arr[i].value = Math.floor(Math.random() * 250) + 1;
        arr[i].goal = Math.floor(Math.random() * 250) + 1;
        // [0.5 - 2] => [5 - 20] / 10
        let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
        arr[i].value = Math.floor(arr[i].goal * multiple);
    }
    return arr;
};
//资金
const pieFund = function mockPieData5() {
    let arr = _.cloneDeep(pieDataFund);
    for(let i = 0; i < 7; i++) {
        // arr[i].value = Math.floor(Math.random() * 250) + 1;
        arr[i].goal = Math.floor(Math.random() * 250) + 1;
        // [0.5 - 2] => [5 - 20] / 10
        let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
        arr[i].value = Math.floor(arr[i].goal * multiple);
    }
    return arr;
};

export { pieChannel,pieDataProduce,pieCustomer,pieOrganization,pieFund };
