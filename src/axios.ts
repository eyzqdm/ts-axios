import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
// 实现axios混合对象 他是一个对象 有Axios类的所有原型属性和实例属性
// 他又是一个方法 可以直接调用
const createInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const context = new Axios(config)
  // 得到Axios的request方法 绑定上下文
  // todo 为何绑定this  request方法内部打印this试试
  // todo AxiosInstance和AxiosStatic？？
  const instance = Axios.prototype.request.bind(context)
  // 拷贝属性
  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
