function getRandomNumArr(length) {
    const rand = function(){return Math.floor(Math.random() * 200) - 100};
    let arr = [];
    for(let i = 0; i < length; i++) {
        arr.push(rand());
    }
    return arr;
}

function mockComparisonAverageData() {
    let arr = [];
    for(let i = 0; i < 7; i++) {
        let arr2 = [];
        for(let v = 0; v < 3; v++) {
            arr2.push(getRandomNumArr(7));
        }
        arr.push(arr2);
    }
    return arr;
}

export default mockComparisonAverageData;
