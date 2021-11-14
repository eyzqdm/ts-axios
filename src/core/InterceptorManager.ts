//import { ResolvedFn, RejectedFn } from '../types'
interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

interface RejectedFn {
  (error: any): any
}
interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    // 用于存放拦截器
    this.interceptors = []
  }
  // 注册拦截器，返回其索引可用于删除
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }
  // 遍历所有拦截器，将每个拦截器作为传入函数的参数并执行
  // 将来用于将拦截器推入promise的调用链中
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
  // 删除拦截器
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
