import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}
interface PromiseChain {
  resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}
export default class Axios {
  interceptors: Interceptors
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      // 只传入了一个参数 则url就是config
      config = url
    }
    config = mergeConfig(this.defaults, config)
    // 将请求发送放入数组
    const chain: PromiseChain[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]
    // 将请求拦截器倒序插入数组前部
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })
    // 将响应拦截器插入数组尾部
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })
    // 初始化一个reslove状态的promise
    let promise = Promise.resolve(config)

    while (chain.length) {
      // 链式调用
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._request('post', url, config, data)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._request('put', url, config, data)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._request('patch', url, config, data)
  }

  _request(method: Method, url: string, config?: AxiosRequestConfig, data?: any) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
