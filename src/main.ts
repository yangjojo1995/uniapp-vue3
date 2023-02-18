import type { ComponentCustomProperties as CoreComponentCustomProperties } from './plugins/app-core'

import { createSSRApp } from 'vue'
import { createCore } from './plugins/app-core'
import { createComment }  from "./plugins/app-comment";
import uView from 'uview-ui'
import "uview-ui/index.scss"
import "./assets/scss/global.scss"
import "app-comment/assets/scss/ac-global.scss"
import App from '@/App.vue'
import config from './config'
import service from './service'
import './utils/socketXctm'


declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    view: any
    image: any
    text: any
  }
  export interface ComponentCustomProperties extends CoreComponentCustomProperties {
    readonly $config: typeof config,
    readonly $service: typeof service
  }
}

export function createApp() {
  const app = createSSRApp(App)
  const core = createCore({ config, service })
  const comment = createComment()  
  app.use(core)
  app.use(uView)
  app.use(comment)
  return { app }
}
