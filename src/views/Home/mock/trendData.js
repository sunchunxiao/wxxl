import _ from 'lodash';

const data = {
    "real": [],
    "target": [],
    "ring": [],
    "yoy": [],
    "subject_name":"",
    "timeLabels": [
        "2018-01-01",
        "2018-01-02",
        "2018-01-03",
        "2018-01-04",
        "2018-01-05",
        "2018-01-06",
        "2018-01-07",
        "2018-01-08",
        "2018-01-09",
        "2018-01-10",
        "2018-01-11",
        "2018-01-12",
        "2018-01-13",
        "2018-01-14",
        "2018-01-15",
        "2018-01-16",
    ]
};

function getRandomNumArr(length, limit, option) {
    let arr = [];
    for(let i = 0; i < length; i++) {
        arr.push(rand(limit, option));
    }
    return arr;
}

function rand(limit, option) {
    if (typeof option === 'number') {
        return Math.floor(Math.random() * limit) + option;
    }
    return Math.floor(Math.random() * limit);
}

const dataProduce = function mockTrendData() {
    let arr = [];
    let subject = ["sku数量","单品平均销售额","单品平均毛利润额","单品平均成本费用","单品平均库存额","单品平均日销","单品平均投入产出比"];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].subject_name = subject[i];
        arr[i].real = getRandomNumArr(30, 1000);
        arr[i].target  = getRandomNumArr(30, 1000);
        arr[i].ring = getRandomNumArr(30, 20, -10);
        arr[i].yoy = getRandomNumArr(30, 20, -10);
    }
    return arr;
};
//渠道
const dataChannel = function mockTrendData1() {
    let arr = [];
    let subject = ["店铺数量","单店平均销售额","单店平均营业利润","单店平均成本费用","单店平均冗余值","单店平均日销","单店平均投入产出比"];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].subject_name = subject[i];
        arr[i].real = getRandomNumArr(30, 1000);
        arr[i].target  = getRandomNumArr(30, 1000);
        arr[i].ring = getRandomNumArr(30, 20, -10);
        arr[i].yoy = getRandomNumArr(30, 20, -10);
    }
    return arr;
};

//客户
const dataCustomer = function mockTrendData2() {
    let arr = [];
    let subject = ["消费者数量","消费者人均销售额","消费者人均客户利润额","消费者人均成本费用","消费者冗余值","消费者人均日销","消费者人均投入产出比"];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].subject_name = subject[i];
        arr[i].real = getRandomNumArr(30, 1000);
        arr[i].target  = getRandomNumArr(30, 1000);
        arr[i].ring = getRandomNumArr(30, 20, -10);
        arr[i].yoy = getRandomNumArr(30, 20, -10);
    }
    return arr;
};

//组织
const dataOrganization = function mockTrendData3() {
    let arr = [];
    let subject = ["企业人数","企业人均销售额","企业人均利润额","企业人均成本费用","消费者冗余值","企业人均日销","企业人均投入产出比"];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].subject_name = subject[i];
        arr[i].real = getRandomNumArr(30, 1000);
        arr[i].target  = getRandomNumArr(30, 1000);
        arr[i].ring = getRandomNumArr(30, 20, -10);
        arr[i].yoy = getRandomNumArr(30, 20, -10);
    }
    return arr;
};
//资金
const dataFund = function mockTrendData4() {
    let arr = [];
    let subject = ["净利润额","销售额","净现金流","总成本费用额","回款","净利率","投资回报率"];
    for(let i = 0; i < 7; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].subject_name = subject[i];
        arr[i].real = getRandomNumArr(30, 1000);
        arr[i].target  = getRandomNumArr(30, 1000);
        arr[i].ring = getRandomNumArr(30, 20, -10);
        arr[i].yoy = getRandomNumArr(30, 20, -10);
    }
    return arr;
};

export { dataProduce,dataChannel,dataCustomer,dataOrganization,dataFund };
