import { isPlainObject } from './util'
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
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}
