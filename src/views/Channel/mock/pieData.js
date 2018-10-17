import _ from 'lodash';

const pieData = [{
    progress: 1.03,
    real: 1510734926,
    subject_name: '毛利润额',
    target: 1480520227.48
},{
    progress: 1.02,
    real: 14357015204,
    subject_name: '销售额',
    target: 13926304747.88
},{
    progress: 1.27,
    real: 12846280278,
    subject_name: '产品成本额',
//  target: 'reverse'
    target: 13926304747.88
},{
    progress: 0.98,
    real: 0.1176,
    subject_name: '产品投入产出比',
    target: 76.17
},{
    progress: 1.09,
    real: 82.79,
    subject_name: '库存周转率',
    target: 76.17
},{
    progress: 1.03,
    real: 94454047,
    subject_name: '日销',
    target: 68006913.84
},{
    progress: 0.84,
    real: 3278360349,
    subject_name: '库存额',
//  target: 'reverse'
    target: 3901248815.31
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
    return arr;
}

export default mockPieData;
