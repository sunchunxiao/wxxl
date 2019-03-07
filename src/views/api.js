import { FetchPost } from 'utils/fetch';

export default {
    Login(params) {
        return FetchPost('/auth', params);
    }
};
