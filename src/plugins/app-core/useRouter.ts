import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import router from './router'

export const routerKey: InjectionKey<typeof router> = Symbol('router')

export function useRouter () {
  return inject<typeof router>(routerKey) as typeof router
}

export default useRouter
