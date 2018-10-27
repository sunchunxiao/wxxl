export function getRank(score){
        if (1 == score) {
            return '差';
        }
        if (2 == score) {
            return '中';
        }
        if (3 == score) {
            return '良';
        }
        if (4 === score) {
            return '优';
        }
        return '差';
}
