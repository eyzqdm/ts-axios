import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'
import { bulidURL } from './helpers/url'
import { AxiosPromise, AxiosRequestConfig } from './types'
import xhr from './xhr'
const axios = (config: AxiosRequestConfig): AxiosPromise => {
  // 发送请求之前处理config
  processConfig(config)
  return xhr(config)
}
const processConfig = (config: AxiosRequestConfig) => {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequest(config)
}
const transformUrl = (config: AxiosRequestConfig): string => {
  const { url, params } = config
  return bulidURL(url, params)
}
const transformHeaders = (config: AxiosRequestConfig) => {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}
export default axios
