const pieDataSales = {
    subject: '',
    subject_name: '',
    subject_unit: ''
};

function setData(dataArr) {
    let arr = [];
    for(let i of dataArr) {
        arr.push(_.cloneDeep(pieDataSales));
        let index = arr.length - 1;
        arr[index].subject = i[0];
        arr[index].subject_name = i[1];
        arr[index].subject_unit = i[2];
    }
    return arr;
}
// 首页-销售
const sales = function () {
    let arr = [
        ["S","销售额","元"],
        ["MOCK","销售增长额","元"]
    ];
    return setData(arr);
};

// 首页-利润
const profit = function () {
    let arr = [
        ["P","净利润额","元"],
        ["NIR","净利润率","%"],
        // ["MOCK","净利润增长额","元"]
    ];
    return setData(arr);
};

// 首页-产品效率
const homeProduct = function () {
    let arr = [
        ["SKU","SKU数量","个"],
        ["S","单品平均销售额","元"],
        ["P","单品平均毛利润额","元"],
        ["C","单品平均成本费用","元"],
        ["SD","单品平均日销","元"],
        ["ROI","单品平均投入产出比",""],
        ["SA","单品平均库存额","元"],
        ["ITO","单品平均库存周转率",""]
    ];
    return setData(arr);
};

// 首页-渠道效率
const homeChannel = function () {
    let arr = [
        ["SHP","店铺数量","个"],
        ["S","单店平均销售额","元"],
        ["P","单店平均营业润额","元"],
        ["C","单店平均成本费用","元"],
        ["SD","单店平均日销","元"],
        ["ROI","单店平均投入产出比",""],
        ["RY","单店平均冗余值","元"]
    ];
    return setData(arr);
};
// 首页-客户效率
const homeCustomer = function () {
    let arr = [
        ["PER","消费者数量","个"],
        ["S","客户销售额","元"],
        ["P","客户利润额","元"],
        ["C","客户费用额","元"],
        ["SD","日销","元"],
        ["ROI","投入产出比",""],
        ["RY","客户冗余值","人"]
    ];
    return setData(arr);
};

// 首页-组织效率
const homeOrganization = function () {
    let arr = [
        ["PER","企业人员数量","人"],
        ["S","销售额","元"],
        ["P","净利润额","元"],
        ["C","人工成本额","元"],
        ["SD","日销","元"],
        ["ROI","投入产出比",""],
        ["POR","人员冗余值","人"]
    ];
    return setData(arr);
};

// 首页-资金效率
const homeFund = function () {
    let arr = [
        ["PER","企业人员数量","人"],
        ["S","总销售额","元"],
        ["P","净利润额","元"],
        ["C","总成本额","元"],
        ["RM","回款额","元"],
        ["ROI","投资回报率",""],
        ["NIR","净利率","%"],
        ["NCF","净现金流","元"],
        ["CTR","资金周转率",""],
        ["RY","资金冗余值","元"]
    ];
    return setData(arr);
};

// 首页-品牌价值
const homeEquity = function () {
    let arr = [
        ["S","传播的投入产出比",""],
        ["MOCK","品质合格率","%"],
        ["MOCK","传播网点数","个"],
        ["MOCK","传播成本","元"],
    ];
    return setData(arr);
};
// 首页-盈利空间
const homeProfitSpace = function () {
    let arr = [
        ["C","总成本费用额","元"],
        ["S","毛利率","%"],
        ["MOCK","回款额","元"],
        ["MOCK","回款增长额","元"],
        ["MOCK","回款增长率","%"],
        ["MOCK","成本费用增长额","元"],
        ["MOCK","成本费用增长率","%"],
        ["MOCK","盈利空间",""],
    ];
    return setData(arr);
};

// 首页-盈利能力
const homeProfitAbility = function () {
    let arr = [
        ["S","订单额","元"],
        ["MOCK","订单增长额","元"],
        ["MOCK","订单增长率","%"],
        ["MOCK","库存额","元"],
        ["MOCK","库存增长额","元"],
        ["MOCK","库存增长率","%"],
        ["MOCK","库存周转率",""],
        ["MOCK","库龄","天"],
        ["MOCK","盈利能力",""],
    ];
    return setData(arr);
};

// 首页-支付能力
const homePay = function () {
    let arr = [
        ["S","净现金流","元"],
        ["MOCK","现金流入","元"],
        ["MOCK","现金流出","元"],
        ["MOCK","应收额","元"],
        ["MOCK","应收增长额","元"],
        ["MOCK","应收增长率","%"],
        ["MOCK","应付额","元"],
        ["MOCK","应付增长额","元"],
        ["MOCK","应付增长率","%"],
        ["MOCK","支付能力1",""],
        ["MOCK","支付能力2",""],
        ["MOCK","资金周转率",""],
        ["MOCK","固定资产占用率","%"],
    ];
    return setData(arr);
};

//产品
const product = function () {
    let arr = [
        ["S","销售额","元"],
        ["P","净利润额","元"],
        ["C","成本额","元"],
        ["SD","日销","元"],
        ["ROI","投入产出比",""],
        ["SA","库存额","元"],
        ["ITO","库存周转率",""]
    ];
    return setData(arr);
};

//渠道
const channel = function () {
    let arr = [
        ["S","销售额","元"],
        ["P","营业利润额","元"],
        ["C","费用额","元"],
        ["SD","日销","元"],
        ["ROI","投入产出比",""],
        ["RY","冗余值","元"]
    ];
    return setData(arr);
};

//客户
const customer = function () {
    let arr = [
        ["S","客户销售额","元"],
        ["P","客户利润额","元"],
        ["C","客户费用额","元"],
        ["SD","日销","元"],
        ["ROI","投入产出比",""],
        ["RY","客户冗余值","人"]
    ];
    return setData(arr);
};
//组织前端
const organization = function () {
    let arr = [
        ["S","销售额","元"],
        ["P","利润额","元"],
        ["C","人工成本额","元"],
        ["SD","日销","元"],
        ["ROI","投入产出比",""],
        ["POR","人员冗余值","人"]
    ];
    return setData(arr);
};
//组织后端
const orgBack = function () {
    let arr = [
        ["C","人工成本额","元"],
        ["ROI","投入产出比",""],
        ["POR","人员冗余值","人"]
    ];
    return setData(arr);
};

//资金前端
const fund = function () {
    let arr = [
        ["S","总销售额","元"],
        ["P","净利润额","元"],
        ["C","总成本额","元"],
        ["RM","回款额","元"],
        ["ROI","投资回报率",""],
        ["NIR","净利率","%"],
        ["NCF","净现金流","元"],
        ["CTR","资金周转率",""],
        ["RY","资金冗余值","元"]
    ];
    return setData(arr);
};
//资金后端
const fundBack = function () {
    let arr = [
        ["C","总成本额","元"]
    ];
    return setData(arr);
};
export {
    profit,
    sales,
    homeProduct,
    homeChannel,
    homeCustomer,
    homeOrganization,
    homeFund,
    homeEquity,
    homeProfitSpace,
    homeProfitAbility,
    homePay,
    product,
    channel,
    customer,
    organization,
    orgBack,
    fund,
    fundBack
};
