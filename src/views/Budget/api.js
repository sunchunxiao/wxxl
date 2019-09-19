import { FetchGet } from 'utils/fetch';

export default {
    GetPlan(params) {
        return FetchGet('/scene/budget', params);
    }
};
