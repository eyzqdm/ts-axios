import { Method } from '../types'
import { deepMerge, isPlainObject } from './util'
const normalizeHeaderName = (headers: any, normalizedName: string): void => {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    // header属性大小写不敏感 这里将其规范化
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export const processHeaders = (headers: any, data: any): any => {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
/**
 * 转换headers字符串为json对象形式 处理回车符 换行符
 */
export const parseHeaders = (headers: string): any => {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }

    let val = vals.join(':').trim()

    parsed[key] = val
  })

  return parsed
}
/**
 * 配置扁平化, 例如经过合并配置的headers是个复杂对象，common get post.... 但事实上每次请求只需当次请求方法的响应配置
 * 该方法依次按common [method] 原headers配置的优先级顺序深度合并。最后将common [method]等属性剔除
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}
