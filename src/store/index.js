// store 多模块 一个getters
import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import getters from './getters';

Vue.use(Vuex);

const isProduction = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
    strict: isProduction, // 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
    modules: {
        ...modules
    },
    getters
});
export default store;
