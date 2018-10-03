import {FetchGet} from 'utils/fetch';

const API = {
    GetProductTree(params) {
        return FetchGet('api/channel/tree', params);
    }
}
export default API;
