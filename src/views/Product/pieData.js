import _ from 'lodash';

const pieData = [{
    value: 30,
    goal: 50,
    text: '毛利润额',
},{
    value: 50,
    goal: 50,
    text: '销售额',
},{
    value: 100,
    goal: 50,
    text: '产品成本额',
},{
    value: 120,
    goal: 180,
    text: '产品投入产出比',
},{
    value: 210,
    goal: 180,
    text: '库存周转率',
},{
    value: 80,
    goal: 90,
    text: '日销',
},{
    value: 10,
    goal: 8,
    text: '库存额',
}];

function mockPieData() {
    let arr = _.cloneDeep(pieData);
    for(let i = 0; i < 7; i++) {
        arr[i].value = Math.floor(Math.random() * 250) + 1;
        arr[i].goal = Math.floor(Math.random() * 250) + 1;
    }
    return arr;
}

export default mockPieData;
