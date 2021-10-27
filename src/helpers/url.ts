import { isDate, isObject } from './util'

const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
/**
 * 拼接 key value
 * 数组
 * 对象 encode
 * Date toISOString
 * 特殊字符 不encode
 * 忽略 null undefined
 * 丢弃哈希
 * 保留url中已存在的参数
 */
export const bulidURL = (url: string, params?: any) => {
  if (!params) {
    return url
  }

  const parts: string[] = []
/**
 * params:{
 * a:[1,2,3]
 * }
 */
  Object.keys(params).forEach((key) => {
    let val = params[key]
    // val  [1,2,3]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values: string[]
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    // key a[]  values [1,2,3]
    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      //丢弃哈希
      url = url.slice(0, markIndex)
    }
   // 保留原有参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
