import { FetchGet} from 'utils/fetch';
// import store from 'store';

export default {
    GetBudget(params) {
        return FetchGet('/scene/budget', params);
    },
};
