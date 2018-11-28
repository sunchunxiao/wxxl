// validate

// 合法uri
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}
  
// 小写字母
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}
  
// 大写字母
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}
  
// 大小写字母
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}
  
// 数字字符串
export function validateStringNumber (str) {
  const reg = /^[0-9]+$/;
  return reg.test(str);
}
  
// 国内手机号
export function validateMobileNumber (str) {
  const reg = /^1\d{10}$/;
  return reg.test(str);
}
  
// 0 和正整数
export function validateIntNumber (str) {
  const reg = /^(0|[1-9][0-9]*)$/;
  return reg.test(str);
}
  
