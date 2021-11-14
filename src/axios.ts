import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/merge'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'
// 实现axios混合对象 他是一个对象 有Axios类的所有原型属性和实例属性
// 他又是一个方法 可以直接调用
const createInstance = (config: AxiosRequestConfig): AxiosStatic => {
  const context = new Axios(config)
  // 得到Axios的request方法 绑定上下文
  // todo 为何绑定this  request内部使用的this.defaults可以直接指向context的defaults。
  // todo AxiosInstance和AxiosStatic？？
  const instance = Axios.prototype.request.bind(context)
  // 拷贝属性
  extend(instance, context)

  return instance as AxiosStatic
}
// 这里原始的axios就直接传入默认配置，最终会被当作实例的this.defaults 没毛病
const axios = createInstance(defaults)
/**
 * 这里的creat之所以可以带config 是因为create一般用来创建自定义实例
 * 自定义实例 则意味着可以有自定义的通用配置。
 * 注意 createInstance中传入的配置给谁了？
 * 注意到createInstance内部会new Axios(config)  这个config最终会当作this.defaults
 * 而当真正调用axios时 传入的config会被再次mergeConfig（具体看request内部实现）
 * axios直接调用相当于调用request 由于之前已经将其this绑定到context上 因此其内部的
 * this.defaults是直接指向context的defaults的。
 */
axios.create = config => {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
axios.all = function all(promises) {
  return Promise.all(promises)
}
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios
export default axios
