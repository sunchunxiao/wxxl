import { FetchPost,FetchGet } from 'utils/fetch';

export default {
    Login(params) {
        return FetchPost('/auth', params);
    },
    Logout(params) {
        return FetchGet('/logout', params);
    }
};
