export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  [propName: string]: any
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string
}
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  getUri(config?: AxiosRequestConfig): string
}
export interface AxiosClassStatic {
  // 类类型 new即constructor
  new (config: AxiosRequestConfig): Axios
}
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url?: string, config?: AxiosRequestConfig): AxiosPromise<T>
}
export interface AxiosStatic extends AxiosInstance {
  // 创建新axios实例
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}
export interface AxiosInterceptorManager<T> {
  // 添加拦截器
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}
export interface AxiosTransformer {
  (data: any, headers?: any): any
}
//CancelToken实例类型的接口定义
export interface CancelToken {
  // 用于寄托的promise
  promise: Promise<Cancel>
  // 取消原因
  reason?: Cancel
  // 判断重复执行 即判断reason是否存在
  throwIfRequested(): void
}
// 取消方法的接口定义 接收取消原因（reason）内部改变promise状态
export interface Canceler {
  (message?: string): void
}
// CancelToken类构造函数参数的接口定义 即CancelToken的constructor 他接收executor函数
// executor函数就是用来将取消函数赋给外部变量的
export interface CancelExecutor {
  (cancel: Canceler): void
}
// source函数的返回值
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}
// CancelToken的类类型
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}
// Cancel实例类型
export interface Cancel {
  message?: string
}
// Cancel类类型
export interface CancelStatic {
  new (message?: string): Cancel
}
// auth对象结构
export interface AxiosBasicCredentials {
  username: string
  password: string
}
