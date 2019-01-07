export function calculatePercent(a, b) {
    if (b > 0) {
        const percent = (a / b * 100).toFixed(0) - 0; //将percent转化为number
        const largerThanOne = (a / b) >= 1;
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