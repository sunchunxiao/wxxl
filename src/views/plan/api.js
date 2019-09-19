import { FetchGet } from 'utils/fetch';

export default {
    GetPlan(params) {
        return FetchGet('/scene/plan', params);
    }
};
