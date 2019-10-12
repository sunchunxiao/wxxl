import echarts from "echarts";
export function calculatePercent(a, b) {
    if (b > 0) {
        const percent = (a / b * 100).toFixed(0) - 0; //将percent转化为number
        const largerThanOne = percent >= 100;
        return {
            percent,
            largerThanOne
        };
    } else {
        const percent = 0;
        const largerThanOne = false;
        return {
            percent,
            largerThanOne
        };
    }
}
export function calculateSort(a, b) {
    if (b > 0) {
        const percent = (a / b * 100).toFixed(0) - 0; //将percent转化为number
        const largerThanOne = percent >=60;
        return {
            percent,
            largerThanOne
        };
    } else {
        const percent = 0;
        const largerThanOne = false;
        return {
            percent,
            largerThanOne
        };
    }
}

export function error(msg) {
    this.$message({
        type: 'error',
        message: msg,
        duration: 2000
    });
}

//多位数字加逗号
const minLength = 3;
export function formatNumber(num) {
    let str = (Math.abs(num) || 0).toString();
    let result = '';
    const valueParts = str.split(".");//有小数时
    if (valueParts[0].length <= minLength) {
        return num;
    } else {
        while (valueParts[0].length > minLength) {
            result = ',' + valueParts[0].slice(-3) + result;
            valueParts[0] = valueParts[0].slice(0, valueParts[0].length - 3);
        }
        if (valueParts[0]) {
            if (num < 0) {//如果是负数添加负号
                result = "-" + valueParts[0] + result;
            } else {
                result = valueParts[0] + result;
            }
        }
        return result;
    }
}

export function addProperty(data) {//树结构添加属性hasData = false
    for (let i of data) {
        data.map(o => {
            o.hasData = false;
        });
        if (i.children && i.children.length) {
            if (this.addProperty(i.children)) {
                return this.addProperty(i.children);
            }
        }
    }
}

function getKey (node) { //渠道树结构的为nid,其他为cid
    return _.get(node, '[0].nid') ? 'nid' : 'cid';
}

export function preOrder(node,cid) {//查找树结构的children节点
    const key = getKey(node);
    for (let i of node) {
        if (i[key] == cid) {
            return i;
        }
        if (i.children && i.children.length) {
            if (this.preOrder(i.children, cid)) {
                return this.preOrder(i.children,cid);
            }
        }
    }
}

export function find(cid, data, arr) {//查找hasData = false 的父节点
    const key = getKey(data);
    for (let i of data) {
        if (i[key] == cid) {
            return true;
        }
        if (i.children && i.children.length) {
            if (!i.hasData) {
                arr.push(i[key]);
            }
            let bool = this.find(cid, i.children, arr);
            if (!bool) {
                if(!i.hasData){
                    arr.pop();
                }
            } else {
                return true;
            }
        }
    }
}
export function labelNewline(num, value, str) {
    if (!str) {
        str = "\n";
    }
    var newParamsName = "";
    var paramsNameNumber = value.length;
    var provideNumber = num;
    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
    if (paramsNameNumber > provideNumber) {
        for (var p = 0; p < rowNumber; p++) {
            var tempStr = "";
            var start = p * provideNumber;
            var end = start + provideNumber;
            if (p == rowNumber - 1) {
                tempStr = value.substring(start, paramsNameNumber);
            } else {
                tempStr = value.substring(start, end) + str;
            }
            newParamsName += tempStr;
        }
    } else {
        newParamsName = value;
    }
    return newParamsName;
}

export function echartAndSliderResize() {
    let chartArr = document.getElementsByClassName("echart");
    if (chartArr.length) {
        for (let i of chartArr) {
            echarts.init(i).resize();
        }
    }
    if (window.onresize) {
        window.onresize();
    }
}

export function formatTimeLabel(valueStr) {
    let arr = valueStr.split("-");
    _.forEach(arr, (v,k) => {
        if (_.isInteger(Number(v))) {
            arr[k] = Number(v);
        }
    });
    return arr.slice(arr.length-2).join('.');
}

//比例结构正负方向画圆角
//值为负数时左侧画圆角，正数右侧画圆角
export function structureRadius(value) {
    if (value >= 0) {
        return [0, 20, 20, 0];
    } else {
        return [20, 0, 0, 20];
    }
}

const REVERSE_TARGET = ['C', 'SA','DR']; // C成本 SA库存额 DR残品率是反向指标

//正反向指标判断
export function subjuctReverse(subject) {
    if (_.includes(REVERSE_TARGET,subject)) {
        return true;
    } else {
        return false;
    }
}
