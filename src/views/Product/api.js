import {FetchGet} from 'utils/fetch';
import store from 'store';

export default {
    GetProductTree(params) {
        FetchGet('/product/tree', params).then(res => {
            store.dispatch('SaveProductTree', res.tree);
        });
    }
}
