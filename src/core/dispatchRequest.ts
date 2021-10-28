import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/header'
import { bulidURL } from '../helpers/url'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from './xhr'
import transform from './transform'
const axios = (config: AxiosRequestConfig): AxiosPromise => {
  // 发送请求之前处理config
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
const transformUrl = (config: AxiosRequestConfig): string => {
  const { url, params } = config
  return bulidURL(url, params)
}
/* const transformHeaders = (config: AxiosRequestConfig) => {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
} */
const transformResponseData = (res: AxiosResponse): AxiosResponse => {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

export default axios
