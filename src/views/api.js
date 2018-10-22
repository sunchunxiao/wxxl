import {FetchGet} from 'utils/fetch';

export default {
    Login(params) {
        return FetchGet('/auth', params);
    }
}
