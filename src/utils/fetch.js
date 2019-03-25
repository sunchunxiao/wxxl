// request

import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
// eslint-disable-next-line
import { getToken, removeToken } from './auth';
import router from '../router/index';
// import qs from 'qs';
// import store from 'store';
axios.defaults.withCredentials = true;
// 创建axios实例
// const SUCCESS_CODE = 0;
const AUTH_FAILED = 401;
const MESSAGEDURATION = 5 * 1000;

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api的base_url
    timeout: 30 * 1000 // 请求超时时间 单位ms
});

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (getToken()) {
        config.headers['Authorization'] = getToken(); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config;
}, error => {
    // Do something with request error
    // eslint-disable-next-line no-console
    console.log('BEFORE_REQUEST_SEND_ERROR', error); // for debug
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(response => {
    const res = response.data;
    if (res.api_info) {
        if (res.api_info.error === 0 && res.api_info.message === 'success') {
            // eslint-disable-next-line no-unused-vars
            const { api_info, ...data } = res;
            return data;
        } else {
            Message({ message: res.api_info.message, type: 'warning', duration: MESSAGEDURATION });
            return Promise.reject(res);
        }
    }
    Message({ message: '接口异常', type: 'warning', duration: MESSAGEDURATION });
    return Promise.reject(res);
},
error => {
    // eslint-disable-next-line no-console
    // console.log('AFTER_RESPONSE_RETURN_ERROR', error.response); // for debug
    if (error.code === "ECONNABORTED") {
        Message({ message: '请求超时', type: 'error', duration: MESSAGEDURATION });
    } else {
        Message({ message: _.get(error, 'response.data.api_info.message') || error.message, type: 'error', duration: MESSAGEDURATION });
        if (error.response.data.api_info.error === AUTH_FAILED) { // token error
            removeToken();
            router.replace('/login');
        }
    }
    return Promise.reject(error);
}
);

const FetchGet = (url, params) => {
    const options = {
        url,
        method: 'get'
    };
    if (params) {
        options.params = params;
    }
    return service(options);
};

// const FetchPostNew = (url, data) => {
//     const options = {
//         url,
//         method: 'post'
//     };
//     if (data) {
//         options.data = data;
//     }
//     return service(options);
// };

const FetchPost = (url, data, params) => {
    const options = {
        url,
        method: 'post'
    };
    if (data) {
        options.data = qs.stringify(data) ;
    }
    if (params) {
        options.params = params;
    }
    return service(options);
};

export { FetchGet, FetchPost };
