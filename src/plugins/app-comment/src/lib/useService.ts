import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import acservice from '../service'

export const acServiceKey: InjectionKey<typeof acservice> = Symbol('acservice')

export function acUseService () {
  return inject<typeof acservice>(acServiceKey) as typeof acservice
}

export default acUseService
