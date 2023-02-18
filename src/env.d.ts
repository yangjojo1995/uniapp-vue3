/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  type AnyObj = Record<string, Function>
  const component: DefineComponent<{}, {}, any>
  export default component
}
