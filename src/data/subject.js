const pieDataSales = {
    subject: '',
    subject_name: '',
};

//产品
const product = function mockPieData1() {
    let arr = [];
    let subject = ["S", 'P', 'C', 'SD','ROI','SA','ITO'];
    let subject_name = ["销售额", '净利润额', '成本额', '日销','投入产出比','库存额','库存周转率'];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
    }
    return arr;
};

//渠道
const channel = function mockPieData22() {
    let arr = [];
    let subject = ["S", 'P', 'C', 'SD','ROI','RY'];
    let subject_name = ["销售额", '营业利润额', '费用额', '日销','投入产出比','冗余值'];
    for(let i = 0; i < 6; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
    }
    return arr;
};

//客户
const customer = function mockPieData3() {
    let arr = [];
    let subject = ["S", 'P', 'C', 'SD','ROI','RY'];
    let subject_name = ["客户销售额", '客户利润额', '客户费用额', '日销','投入产出比','客户冗余值'];
    for(let i = 0; i < 6; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
    }
    return arr;
};
//组织前端
const organization = function mockPieData4() {
    let arr = [];
    let subject = ["S", 'P', 'C', 'SD','ROI','POR'];
    let subject_name = ["销售额", '利润额', '人工成本额', '日销','投入产出比','人员冗余值'];
    for(let i = 0; i < 6; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
    }
    return arr;
};
//组织后端
const orgBack = function mockPieData5() {
    let arr = [];
    let subject = ['C','ROI','POR'];
    let subject_name = ['人工成本额', '投入产出比','人员冗余值'];
    for(let i = 0; i < 3; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
    }
    return arr;
};

//资金前端
const fund = function mockPieData4() {
    let arr = [];
    let subject = ["S", 'P', 'C', 'RM','ROI','NIR','NCF','CTR','RY'];
    let subject_name = ["总销售额", '净利润额', '总成本额', '回款额','投资回报率','净利率','净现金流','资金周转率','资金冗余值'];
    for(let i = 0; i < 9; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
    }
    return arr;
};
//资金后端
const fundBack = function mockPieData5() {
    let arr = [];
    let subject = ['C'];
    let subject_name = ['总成本额'];
    for(let i = 0; i < 1; i++) {
        arr.push(_.cloneDeep(pieDataSales));
        arr[i].subject = subject[i];
        arr[i].subject_name = subject_name[i];
    }
    return arr;
};
export { product, channel, customer, organization, orgBack, fund, fundBack };
