export function calculatePercent(a, b) {
    if (b > 0) {
        const percent = (a / b * 100).toFixed(0) - 0; //将percent转化为number
        const largerThanOne = (a / b) > 1;
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
