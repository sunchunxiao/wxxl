
const pieDataSales = {
    progress: '',
    real: '',
    subject: '',
    subject_name: '',
    target: ''
};

function getRandomNumArr(length, limit, option) {
    let arr;
    for(let i = 0; i < length; i++) {
        arr = rand(limit, option);
    }
    return arr;
}
function rand(limit, option) {
    if (typeof option === 'number') {
        return Math.floor(Math.random() * limit) + option;
    }
    return (Math.random() * limit).toFixed(2);
}

// const pieDataProduce = function mockPieproduce1() {
//     let arr1 = _.cloneDeep(pieProduce);
//     for(let i = 0; i < 7; i++) {
//         arr1[i].goal = Math.floor(Math.random() * 250) + 1;
//         let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
//         arr1[i].value = Math.floor(arr1[i].goal * multiple);
//     }
//     return arr1;
// };
// //渠道
// const pieChannel = function mockPieData2() {
//     let arr = _.cloneDeep(pieData);
//     for(let i = 0; i < 7; i++) {
//         arr[i].goal = Math.floor(Math.random() * 250) + 1;
//         let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
//         arr[i].value = Math.floor(arr[i].goal * multiple);
//     }
//     return arr;
// };
// //客户
// const pieCustomer = function mockPieData3() {
//     let arr = _.cloneDeep(pieDataCustomer);
//     for(let i = 0; i < 7; i++) {
//         arr[i].goal = Math.floor(Math.random() * 250) + 1;
//         let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
//         arr[i].value = Math.floor(arr[i].goal * multiple);
//     }
//     return arr;
// };
// //组织
// const pieOrganization = function mockPieData4() {
//     let arr = _.cloneDeep(pieDataOrganization);
//     for(let i = 0; i < 7; i++) {
//         arr[i].goal = Math.floor(Math.random() * 250) + 1;
//         let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
//         arr[i].value = Math.floor(arr[i].goal * multiple);
//     }
//     return arr;
// };
// //资金
// const pieFund = function mockPieData5() {
//     let arr = _.cloneDeep(pieDataFund);
//     for(let i = 0; i < 7; i++) {
//     // arr[i].value = Math.floor(Math.random() * 250) + 1;
//         arr[i].goal = Math.floor(Math.random() * 250) + 1;
//         // [0.5 - 2] => [5 - 20] / 10
//         let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
//         arr[i].value = Math.floor(arr[i].goal * multiple);
//     }
//     return arr;
// };

//销售
const pieSales = function mockPieData6() {
    let arr = [];
    let subject = ["S", 'SR'];
    let subject_name = ["销售额", '销售增长额'];
    for (let i = 0; i < 2; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].progress = getRandomNumArr(1, 2);
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(1, 10000000);
        arr[i].target  = getRandomNumArr(1, 10000000);
    }
    return arr;
};

//利润
const pieProfit = function mockPieData7() {
    let arr = [];
    let subject = ["P", 'PP', 'PR'];
    let subject_name = ["净利润额", '净利润率', '净利润增长额'];
    for(let i = 0; i < 3; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].progress = getRandomNumArr(1, 2);
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(1, 10000000);
        arr[i].target  = getRandomNumArr(1, 10000000);
    }
    return arr;
};

//利润
const pieEquity = function mockPieData7() {
    let arr = [];
    let subject = ["ROI", 'PC', 'PR', 'RR'];
    let subject_name = ["传播的投入产出比", '品质合格率', '传播网点数', '传播成本'];
    for(let i = 0; i < 4; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].progress = getRandomNumArr(1, 2);
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(1, 10000000);
        arr[i].target  = getRandomNumArr(1, 10000000);
    }
    return arr;
};

//盈利空间
const profitSpace = function mockPieData7() {
    let arr = [];
    let subject = ["ROI", 'PC', 'PR', 'RR','C','CC'];
    let subject_name = ["毛利润率", '回款额', '回款增长额', '回款增长率','成本费用额','成本费用增长率'];
    for(let i = 0; i < 6; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].progress = getRandomNumArr(1, 2);
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(1, 10000000);
        arr[i].target  = getRandomNumArr(1, 10000000);
    }
    return arr;
};

//盈利能力
const profitAbility = function mockPieData7() {
    let arr = [];
    let subject = ["ROI", 'PC', 'PR', 'RR','C','CC','DD'];
    let subject_name = ["订单额", '订单增长额', '订单增长率', '库存额','库龄','库存增长额','库存增长率'];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].progress = getRandomNumArr(1, 2);
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(1, 10000000);
        arr[i].target  = getRandomNumArr(1, 10000000);
    }
    return arr;
};

//支付能力
const pay = function mockPieData7() {
    let arr = [];
    let subject = ["ROI", 'PC', 'PR', 'RR','C','CC','DD'];
    let subject_name = ["净现金流", '现金流入', '现金流出', '应收额','应收增长额','应收增长率','应付额'];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].progress = getRandomNumArr(1, 2);
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(1, 10000000);
        arr[i].target  = getRandomNumArr(1, 10000000);
    }
    return arr;
};
export { pieSales, pieProfit, pieEquity, profitSpace, profitAbility, pay };
