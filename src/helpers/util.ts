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
/**
 * 拷贝对象方法
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
/**
 * 递归合并 思路类似深拷贝
 * 基本类型 直接合并
 * 引用类型值 判断原属性是否是引用类型，如果是，则递归合并。不是，则用一个空对象与之合并。
 */
export const deepMerge = (...objs: any[]): any => {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge({}, val)
          }
        } else {
          //非引用值 直接合并
          result[key] = val
        }
      })
    }
  })
  return result
}
/**
 * 判断formdata 用于调整contentType字段
 */
export function isFormData(val: any): boolean {
  return typeof val !== 'undefined' && val instanceof FormData
}
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
