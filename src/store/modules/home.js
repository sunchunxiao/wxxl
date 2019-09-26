const home = {
    state: {
        overviewArr: [],
        overviewTrendArr: [],
        productArr: [],
        productTrendArr: [],
        channelArr: [],
        channelTrendArr: [],
        orgHomeArr: [],
        orgTrendArr: [],
        fundHomeArr: [],
        fundHomeTrendArr: [],
        cusHomeArr: [],
        cusHomeTrendArr: [],
        searchDate: {},
        homeLastParams: {},
        salePrograssArr: [],
        saleTrendArr: [],
        profitPrograssArr: [],
        profitTrendArr: [],
        gainPrograssArr: [],
        gainTrendArr: [],
        payPrograssArr: [],
        payTrendArr: [],
        abilityPrograssArr: [],
        abilityTrendArr: [],
        brandPrograssArr: [],
        brandTrendArr: [],
        salesRadarObj: {},
        profitRadarObj: {},
        productRadarObj: {},
        channelRadarObj: {},
        customerRadarObj: {},
        organizationRadarObj: {},
        fundRadarObj: {},
        equityRadarObj: {},
        payRadarObj: {},
        profitSpaceRadarObj: {},
    },
    mutations: {
        SAVE_OVERVIEW_ARR: (state, arr) => {
            state.overviewArr = arr;
        },
        SAVE_OVERVIEWTREND_ARR: (state, arr) => {
            state.overviewTrendArr = arr;
        },
        SAVE_HOMEPRODUCT_ARR: (state, arr) => {
            state.productArr = arr;
        },
        SAVE_PRODUCTTREND_ARR: (state, arr) => {
            state.productTrendArr = arr;
        },
        SAVE_CHANNELPROGRASS_ARR: (state, arr) => {
            state.channelArr = arr;
        },
        SAVE_CHANNELTREND_ARR: (state, arr) => {
            state.channelTrendArr = arr;
        },
        SAVE_HOMEORGPROGRASS_ARR: (state, arr) => {
            state.orgHomeArr = arr;
        },
        SAVE_ORGHOMETREND_ARR: (state, arr) => {
            state.orgTrendArr = arr;
        },
        SAVE_HOMEFUNDPROGRASS_ARR: (state, arr) => {
            state.fundHomeArr = arr;
        },
        SAVE_FUNDHOMETREND_ARR: (state, arr) => {
            state.fundHomeTrendArr = arr;
        },
        SAVE_HOMECUSPROGRASS_ARR: (state, arr) => {
            state.cusHomeArr = arr;
        },
        SAVE_CUSHOMETREND_ARR: (state, arr) => {
            state.cusHomeTrendArr = arr;
        },
        SAVE_SEARCH_DATE: (state, date) => {
            state.searchDate = date;
        },
        SAVE_HOMELAST_PARAMS: (state, lastParams) => {
            state.homeLastParams = Object.assign({}, state.homeLastParams, lastParams);
        },
        SAVE_SALE_ARR: (state, arr) => {
            state.salePrograssArr = arr;
        },
        SAVE_SALETREND_ARR: (state, arr) => {
            state.saleTrendArr = arr;
        },
        SAVE_PROFIT_ARR: (state, arr) => {
            state.profitPrograssArr = arr;
        },
        SAVE_PROFITTREND_ARR: (state, arr) => {
            state.profitTrendArr = arr;
        },
        SAVE_GAIN_ARR: (state, arr) => {
            state.gainPrograssArr = arr;
        },
        SAVE_GAINTREND_ARR: (state, arr) => {
            state.gainTrendArr = arr;
        },
        SAVE_PAY_ARR: (state, arr) => {
            state.payPrograssArr = arr;
        },
        SAVE_PAYTREND_ARR: (state, arr) => {
            state.payTrendArr = arr;
        },
        SAVE_ABILITY_ARR: (state, arr) => {
            state.abilityPrograssArr = arr;
        },
        SAVE_ABILITYTREND_ARR: (state, arr) => {
            state.abilityTrendArr = arr;
        },
        SAVE_BRAND_ARR: (state, arr) => {
            state.brandPrograssArr = arr;
        },
        SAVE_BRANDTREND_ARR: (state, arr) => {
            state.brandTrendArr = arr;
        },
        SAVE_SALESRADAR_OBJ: (state, obj) => {
            state.salesRadarObj = obj;
        },
        SAVE_PROFITRADAR_OBJ: (state, obj) => {
            state.profitRadarObj = obj;
        },
        SAVE_PRODUCTRADAR_OBJ: (state, obj) => {
            state.productRadarObj = obj;
        },
        SAVE_CHANNELRADAR_OBJ: (state, obj) => {
            state.channelRadarObj = obj;
        },
        SAVE_CUSTOMERRADAR_OBJ: (state, obj) => {
            state.customerRadarObj = obj;
        },
        SAVE_ORGANIZATIONRADAR_OBJ: (state, obj) => {
            state.organizationRadarObj = obj;
        },
        SAVE_FUNDRADAR_OBJ: (state, obj) => {
            state.fundRadarObj = obj;
        },
        SAVE_EQUITYRADAR_OBJ: (state, obj) => {
            state.equityRadarObj = obj;
        },
        SAVE_PAYRADAR_OBJ: (state, obj) => {
            state.payRadarObj = obj;
        },
        SAVE_SPACERADAR_OBJ: (state, obj) => {
            state.profitSpaceRadarObj = obj;
        },
    },
    actions: {
        SaveOverviewProgressData({ commit }, arr) {
            commit('SAVE_OVERVIEW_ARR', arr);
        },
        SaveOverviewTrendArr({ commit }, arr) {
            commit('SAVE_OVERVIEWTREND_ARR', arr);
        },
        SaveProductProgressData({ commit }, arr) {
            commit('SAVE_HOMEPRODUCT_ARR', arr);
        },
        SaveProductTrendArr({ commit }, arr) {
            commit('SAVE_PRODUCTTREND_ARR', arr);
        },
        SaveChannelProgressData({ commit }, arr) {
            commit('SAVE_CHANNELPROGRASS_ARR', arr);
        },
        SaveChannelTrendArr({ commit }, arr) {
            commit('SAVE_CHANNELTREND_ARR', arr);
        },
        SaveOrgHomeProgress({ commit }, arr) {
            commit('SAVE_HOMEORGPROGRASS_ARR', arr);
        },
        SaveOrgHomeTrendArr({ commit }, arr) {
            commit('SAVE_ORGHOMETREND_ARR', arr);
        },
        SaveFundHomeProgress({ commit }, arr) {
            commit('SAVE_HOMEFUNDPROGRASS_ARR', arr);
        },
        SaveFundHomeTrendArr({ commit }, arr) {
            commit('SAVE_FUNDHOMETREND_ARR', arr);
        },
        SaveCusHomeProgress({ commit }, arr) {
            commit('SAVE_HOMECUSPROGRASS_ARR', arr);
        },
        SaveCusHomeTrendArr({ commit }, arr) {
            commit('SAVE_CUSHOMETREND_ARR', arr);
        },
        SaveSearchDate({ commit }, date) {
            commit('SAVE_SEARCH_DATE', date);
        },
        SaveHomeLastParams({ commit }, lastParams) {
            commit('SAVE_HOMELAST_PARAMS', lastParams);
        },
        SaveSaleProgressData({ commit }, arr) {
            commit('SAVE_SALE_ARR', arr);
        },
        SaveSaleTrendArr({ commit }, arr) {
            commit('SAVE_SALETREND_ARR', arr);
        },
        SaveProfitProgressData({ commit }, arr) {
            commit('SAVE_PROFIT_ARR', arr);
        },
        SaveProfitTrendArr({ commit }, arr) {
            commit('SAVE_PROFITTREND_ARR', arr);
        },
        SaveGainProgressData({ commit }, arr) {
            commit('SAVE_GAIN_ARR', arr);
        },
        SaveGainTrendArr({ commit }, arr) {
            commit('SAVE_GAINTREND_ARR', arr);
        },
        SavePayProgressData({ commit }, arr) {
            commit('SAVE_PAY_ARR', arr);
        },
        SavePayTrendArr({ commit }, arr) {
            commit('SAVE_PAYTREND_ARR', arr);
        },
        SaveAbilityProgressData({ commit }, arr) {
            commit('SAVE_ABILITY_ARR', arr);
        },
        SaveAbilityTrendArr({ commit }, arr) {
            commit('SAVE_ABILITYTREND_ARR', arr);
        },
        SaveBrandProgressData({ commit }, arr) {
            commit('SAVE_BRAND_ARR', arr);
        },
        SaveBrandTrendArr({ commit }, arr) {
            commit('SAVE_BRANDTREND_ARR', arr);
        },
        //基本竞争力
        SaveSalesRadarObj({ commit }, obj) {
            commit('SAVE_SALESRADAR_OBJ', obj);
        },
        //持续竞争力
        SaveProfitRadarObj({ commit }, obj) {
            commit('SAVE_PROFITRADAR_OBJ', obj);
        },
        //核心竞争力_产品效率
        SaveProductRadarObj({ commit }, obj) {
            commit('SAVE_PRODUCTRADAR_OBJ', obj);
        },
        //核心竞争力_渠道效率
        SaveChannelRadarObj({ commit }, obj) {
            commit('SAVE_CHANNELRADAR_OBJ', obj);
        },
        //核心竞争力_客户效率
        SaveCustomerRadarObj({ commit }, obj) {
            commit('SAVE_CUSTOMERRADAR_OBJ', obj);
        },
        //核心竞争力_组织效率
        SaveOrganizationRadarObj({ commit }, obj) {
            commit('SAVE_ORGANIZATIONRADAR_OBJ', obj);
        },
        //核心竞争力_资金效率
        SaveFundRadarObj({ commit }, obj) {
            commit('SAVE_FUNDRADAR_OBJ', obj);
        },
        //品牌价值
        SaveEquityRadarObj({ commit }, obj) {
            commit('SAVE_EQUITYRADAR_OBJ', obj);
        },
        // 支付
        SavePayRadar({ commit }, obj) {
            commit('SAVE_PAYRADAR_OBJ', obj);
        },
        // 盈利空间
        SaveSpaceRadar({ commit }, obj) {
            commit('SAVE_SPACERADAR_OBJ', obj);
        },
    }
};

export default home;
