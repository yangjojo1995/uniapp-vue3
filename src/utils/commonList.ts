import { reactive} from 'vue'
import { useService } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import { onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import {  onShow } from "@dcloudio/uni-app";

/**
 * 列表通用封装工具类
 */

let createRequest = async (page: number, size: number, key: string, api: string) => {
  const service = useService()
  const { total, records } = await service[key][api]({page, size})
  return { total, records }
}
let newPagingLazy = function(key: string, api: string){
  return reactive(
    new PagingLazy(async function (page, size) {
      return await createRequest(page, size, key, api)
    }
  ))
}

function createPagingLazy(key: string, api: string){
  const pagingLazy = newPagingLazy(key, api)
  pagingLazy.load()

  async function pullDownRefresh() {
    await pagingLazy.refresh()
    uni.stopPullDownRefresh();
  }

  async function reachBottom() {
    pagingLazy.next()
  }

  return {
    pagingLazy: pagingLazy,
    pullDownRefresh: pullDownRefresh,
    reachBottom: reachBottom
  }
}

export { createPagingLazy, onPullDownRefresh, onReachBottom, useService, onShow }
