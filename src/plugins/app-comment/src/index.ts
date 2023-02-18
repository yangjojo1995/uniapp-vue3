import commentConfig from "./config/config";
import { acServiceKey } from './lib/useService'
import acService from './service'

export interface CoreOptions {
  readonly config: Record<string, any>,
  readonly acService: Record<string, Record<string, Function>>
}

function createComment () {
  function install (app: any ) {
    app.config.globalProperties.$commentConfig = commentConfig
    app.config.globalProperties.$acService = acService
    app.provide(acServiceKey, acService)
  }
  return { install }
}

export {
  createComment
} 


