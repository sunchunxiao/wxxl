const WXXLTOKEN = 'wxxl_token';
const WXXLUSERNAME = 'wxxl_user';

export function setToken (token) {
  window.sessionStorage.setItem(WXXLTOKEN, 'Bearer ' + token);
}

export function getToken () {
  return window.sessionStorage.getItem(WXXLTOKEN);
}

export function removeToken () {
  window.sessionStorage.removeItem(WXXLTOKEN);
  removeUsername();
}

export function setUsername (username) {
  window.sessionStorage.setItem(WXXLUSERNAME, username);
}

export function getUsername () {
  return window.sessionStorage.getItem(WXXLUSERNAME);
}

export function removeUsername () {
  window.sessionStorage.removeItem(WXXLUSERNAME);
}
