const WXXLTOKEN = 'wxxl_token';

export function setToken (token) {
    window.sessionStorage.setItem(WXXLTOKEN, 'Bearer ' + token);
}

export function getToken () {
    return window.sessionStorage.getItem(WXXLTOKEN);
}

export function removeToken () {
    window.sessionStorage.removeItem(WXXLTOKEN);
}
