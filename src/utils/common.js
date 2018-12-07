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
