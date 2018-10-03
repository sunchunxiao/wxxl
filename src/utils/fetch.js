// request

import axios from 'axios';
// import qs from 'qs';
import { Message } from 'element-ui';
// import store from 'store';

// 创建axios实例
// const SUCCESS_CODE = 0;
// const TOKEN_EXPIRED_CODE = 402;

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间 单位ms
});

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
//   if (getToken()) {
//     config.headers['token'] = getToken(); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
//   }
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
  return res;
  // if (res.retCode === SUCCESS_CODE) {
  //   return res.retData;
  // }
  // if (res.retCode === TOKEN_EXPIRED_CODE) {
  //   // store.dispatch('ExpiredToken').then(() => {
  //   //   location.reload();
  //   // });
  // }
  // Message({message: res.retMsg, type: 'warning', duration: 6 * 1000});
  // return Promise.reject(res);
},
  error => {
    // eslint-disable-next-line no-console
    console.log('AFTER_RESPONSE_RETURN_ERROR', error); // for debug
    Message({message: error.message, type: 'error', duration: 5 * 1000});
    return Promise.reject(error);
  }
);

const FetchGet = (url, params) => {
  const options = {
    url,
    method: 'get'
  };
  if(params) {
    options.params = params;
  }
  return service(options);
}

const FetchPost = (url, data, params) => {
  const options = {
    url,
    method: 'post'
  };
  if(data) {
    options.data = data;
  }
  if(params) {
    options.params = params;
  }
  return service(options);
}


export {FetchGet, FetchPost};
