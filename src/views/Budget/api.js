import { FetchGet } from 'utils/fetch';

export default {
    GetBudget(params) {
        return FetchGet('/scene/budget', params);
    }
};
