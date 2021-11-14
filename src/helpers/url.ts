import { isDate, isObject, isURLSearchParams } from './util'
interface URLOrigin {
  protocol: string
  host: string
}

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
export const buildURL = (url: string, params?: any, paramsSerializer?: (params: any) => string) => {
  if (!params) {
    return url
  }
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    /**
     * params:{
     * a:[1,2,3]
     * }
     */
    Object.keys(params).forEach(key => {
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
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    serializedParams = parts.join('&')
  }

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
const urlParsingNode = document.createElement('a')
/**
 * 通过a标签 拿到protocol 和 host 判断同源
 */
const resolveURL = (url: string): URLOrigin => {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
const currentOrigin = resolveURL(window.location.href)
export const isURLSameOrigin = (requestURL: string): boolean => {
  const { protocol, host } = currentOrigin
  const parsedOrigin = resolveURL(requestURL)
  return parsedOrigin.protocol === protocol && parsedOrigin.host === host
}
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
