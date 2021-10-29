import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

interface ResolvePromise {
  (reason?: Cancel): void
}
import Cancel from './Cancel'
/**
 * 注意区分axios.CancelToken 和config中的cancelToken 他们是类与实例的关系
 * 两种用法
 * 1 CancelToken.source()方法 返回token和cancel
 * token赋值给config配置中的cancelToken，他其中有被寄托的promise
 * cancel则是取消方法
 * 2 直接给config的cancelToken new一个CancelToken。区别是需要自己声明一个cancel变量 用来在new CancelToken时的执行器函数内接受取消函数。
 */
export default class CancelToken {
  // 实例属性
  promise: Promise<Cancel>
  reason?: Cancel
  //静态方法 用于第二种用法 本质上是一样的
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    // 声明一个pending状态的promise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    /**
     * 执行new时，该函数的参数会被赋值给外部变量cancel，即取消函数
     * 即该函数的参数是一个函数 它要执行取消逻辑 改变promise的状态即可
     */
    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }
  // 实例方法
  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }
}
