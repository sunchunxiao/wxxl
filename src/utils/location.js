// get parameter from url
export function getParam (key, strURL) {
  return new RegExp('(^|\\?|&)' + key + '=([^&]*)(\\s|&|$)', 'i').test(strURL) ? decodeURIComponent(RegExp.$2.replace(/\+/g, ' ')) : '';
}
  
