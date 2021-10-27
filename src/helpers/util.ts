const toString = Object.prototype.toString

export const isDate = (val: any): val is Date => {
  return toString.call(val) === '[object Date]'
}

export const isObject = (val: any): val is Object => {
  return val !== null && typeof val === 'object'
}
/**
 * FormData、ArrayBuffer 这些类型，isObject 判断也为 true, isPlainObject的判断方式只有定义的普通 JSON 对象才能满足
 */
export const isPlainObject = (val: any): val is Object => {
  return toString.call(val) === '[object Object]'
}
