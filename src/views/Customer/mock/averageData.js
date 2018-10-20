import _ from 'lodash';

const data = [
    {
        "subject": "毛利润额",
        "type": "quota",
        "total": "14357015204",
        "avg":"3589253801",
        "values":[3201099582,3653972833,3748479819,3753462970],
        "nodes": ["麦克适","可优比","蒂爱","米歌"],
    },
    {
        "subject": "销售额",
        "type": "quota",
        "avg":"3589253801",
        "total": "14357015204",
        "values":[3201099582,3653972833,3748479819,3753462970],
        "nodes": ["麦克适","可优比","蒂爱","米歌"],
    },{
        "subject": "产品成本额",
        "type": "quota",
        "avg":"3211570069.5",
        "values":[3201099582,3653972833,3748479819,3753462970],
        "total": "14357015204",
        "nodes": ["麦克适","可优比","蒂爱","米歌"],
    },{
        "subject": "产品投入产出比",
        "avg":"0.12",
        "total": "0.1176",
        "values":[0.1174,0.1175,0.1176,0.118],
        "nodes": ["麦克适","可优比","蒂爱","米歌"],
    },{
        "subject": "库存周转率",
        "avg":"82.79",
        "total": "82.79",
        "values":[81.93,82.89,83.02,83.21],
        "nodes": ["麦克适","可优比","蒂爱","米歌"],
    },{
        "subject": "日销",
        "type": "quota",
        "avg":"23613511.75",
        "total": "94454047",
        "values":[21059865,24039294,24661051,24693835],
        "nodes": ["麦克适","可优比","蒂爱","米歌"],
    },{
        "subject": "库存额",
        "type": "quota",
        "avg":"819590087.25",
        "total": "3278360349",
        "values":[737370831,830580214,844690065,865719239],
        "nodes": ["麦克适","可优比","蒂爱","米歌"],
    }
];

function mockAverageData() {
    let arr = _.cloneDeep(data);
    for(let i = 0; i < arr.length; i++) {
        for(let v = 0; v < arr[i].nodes.length; v++) {
            arr[i].total = Math.floor(Math.random() * 10000 * 10000) + '';
//          arr[i].data[v].target = Math.floor(Math.random() * 10000 * 10000) + '';
        }
    }
    return arr;
}

export default mockAverageData;
