
const data = {
    "hasTarget":[],
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

//销售
const dataSales = function mockTrendData1() {
    let arr = [];
    let subject_name = ["销售额", '销售增长额'];
    for(let i = 0; i < 2; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].hasTarget = getRandomNumArr(16, 2);
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(16, 1000);
        arr[i].target  = getRandomNumArr(16, 1000);
        arr[i].ring = getRandomNumArr(16, 20, -10);
        arr[i].yoy = getRandomNumArr(16, 20, -10);
    }
    return arr;
};

//销售
const dataProfitTrend = function mockTrendData2() {
    let arr = [];
    let subject_name = ["净利润额", '净利润率', '净利润增长额'];
    for(let i = 0; i < 3; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].hasTarget = getRandomNumArr(16, 2);
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(16, 1000);
        arr[i].target  = getRandomNumArr(16, 1000);
        arr[i].ring = getRandomNumArr(16, 20, -10);
        arr[i].yoy = getRandomNumArr(16, 20, -10);
    }
    return arr;
};

//品牌价值
const dataEquity = function mockTrendData3() {
    let arr = [];
    let subject_name = ["传播的投入产出比", '品质合格率', '传播网点数', '传播成本'];
    for(let i = 0; i < 4; i++) {
        arr.push(_.cloneDeep(data));
        arr[i].hasTarget = getRandomNumArr(16, 2);
        arr[i].subject_name = subject_name[i];
        arr[i].real = getRandomNumArr(16, 1000);
        arr[i].target  = getRandomNumArr(16, 1000);
        arr[i].ring = getRandomNumArr(16, 20, -10);
        arr[i].yoy = getRandomNumArr(16, 20, -10);
    }
    return arr;
};
export { dataEquity, dataSales, dataProfitTrend };
