let originDate = getOriginDate();

function getOriginDate() {
    const endTimeSet = process.env.VUE_APP_END_TIME_SET;
    let originDate = {};
    let cMoment = moment();
    if (endTimeSet && _.isDate(new Date(endTimeSet))) {
        cMoment = moment(endTimeSet);
    }
    // 日 昨天 - 前一个月
    originDate.dayRange = [
        _.cloneDeep(cMoment).subtract(1, 'M').subtract(1, 'd').format('YYYY-MM-DD'),
        _.cloneDeep(cMoment).subtract(1, 'd').format('YYYY-MM-DD')
    ];
    // 周 前一周 - 前四周
    originDate.weekStart = new Date(_.cloneDeep(cMoment).subtract(5, 'w').startOf('week').format('YYYY-MM-DD'));
    originDate.weekEnd = new Date(_.cloneDeep(cMoment).subtract(1, 'w').endOf('week').format('YYYY-MM-DD'));
    // 月 前四个月 - 上个月
    originDate.monthStart = new Date(_.cloneDeep(cMoment).subtract(4, 'M').startOf('month').format('YYYY-MM-DD'));
    originDate.monthEnd = new Date(_.cloneDeep(cMoment).subtract(1, 'M').endOf('month').format('YYYY-MM-DD'));
    // 季 前五季 - 前一季 (前15月 - 前3月)
    originDate.seasonStart = new Date(_.cloneDeep(cMoment).subtract(15, 'M').startOf('quarter').format('YYYY-MM-DD'));
    originDate.seasonEnd = new Date(_.cloneDeep(cMoment).subtract(3, 'M').endOf('quarter').format('YYYY-MM-DD'));
    // 年 前年 - 去年
    originDate.yearStart = new Date(_.cloneDeep(cMoment).subtract(2, 'y').startOf('year').format('YYYY-MM-DD'));
    originDate.yearEnd = new Date(_.cloneDeep(cMoment).subtract(1, 'y').endOf('year').format('YYYY-MM-DD'));
    return originDate;
}

const date = {
    state: {
        date: originDate
    },
    mutations: {
        SAVE_DATE: (state, date) => {
            state.date = date;
        }
    },
    actions: {
        SaveDate({ commit }, date) {
            commit('SAVE_DATE', date);
        }
    }
};

export default date;
