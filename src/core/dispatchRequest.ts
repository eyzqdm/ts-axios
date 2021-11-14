import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, parseHeaders, processHeaders } from '../helpers/header'
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from './xhr'
import transform from './transform'
const axios = (config: AxiosRequestConfig): AxiosPromise => {
  // 发送请求之前处理config
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

const processConfig = (config: AxiosRequestConfig) => {
  config.url = transformUrl(config)
  //这步合并在默认的transformRequest中
  //config.headers = transformHeaders(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}
export const transformUrl = (config: AxiosRequestConfig): string => {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}
/* const transformHeaders = (config: AxiosRequestConfig) => {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
} */
const transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
const throwIfCancellationRequested = (config: AxiosRequestConfig): void => {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default axios
