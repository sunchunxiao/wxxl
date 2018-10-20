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
    target: 'reverse'
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
    target: 'reverse'
}];

function mockPieData() {
    let arr = _.cloneDeep(pieData);
    for(let i = 0; i < 7; i++) {
        // arr[i].value = Math.floor(Math.random() * 250) + 1;
        arr[i].goal = Math.floor(Math.random() * 250) + 1;
        // [0.5 - 2] => [5 - 20] / 10
        let multiple = Math.floor((Math.random() * 16 + 5)) / 10;
        arr[i].value = Math.floor(arr[i].goal * multiple);
    }
//  console.log(arr)
    return arr;
}

export default mockPieData;
