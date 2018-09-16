import _ from 'lodash';

let data = {
    "real": [],
    "target": [],
    "ring": [],
    "yoy": [],
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
        "2018-01-17",
        "2018-01-18",
        "2018-01-19",
        "2018-01-20",
        "2018-01-21",
        "2018-01-22",
        "2018-01-23",
        "2018-01-24",
        "2018-01-25",
        "2018-01-26",
        "2018-01-27",
        "2018-01-28",
        "2018-01-29",
        "2018-01-30"
    ]
}
let arr = [];
for(let i = 0; i < 7; i++) {
    arr.push(_.cloneDeep(data));
    arr[i].real = getRandomNumArr(30, 1000);
    arr[i].target  = getRandomNumArr(30, 1000);
    arr[i].ring = getRandomNumArr(30, 20, -10);
    arr[i].yoy = getRandomNumArr(30, 20, -10);
}

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

export default arr;
