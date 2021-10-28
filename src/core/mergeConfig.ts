import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'
/**
 * 默认合并策略 有自定义就用自定义
 */
const defaultStrat = (val1: any, val2: any): any => {
  return typeof val2 !== 'undefined' ? val2 : val1
}
/**
 * 自定义配置合并策略，有就用。 适用于性没有默认配置的属性 url params data
 */
const fromVal2Strat = (val1: any, val2: any): any => {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})
//复杂对象合并 headers
const deepMergeStrat = (val1: any, val2: any): any => {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})
const strats = Object.create(null)
/**
 *
 * @param config1 默认配置
 * @param config2 自定义配置
 * @returns
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)
  // 优先合并自定义配置
  for (let key in config2) {
    mergeField(key)
  }
  // 合并默认配置 只有在没有自定义配置时才使用默认配置
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 优先自定义配置合并策略 没有则用默认策略
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
