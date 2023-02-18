<template>
  <view>
    <ym-project-item
      :myProject="true"
      @item-click="goDetail(item.id)"
      @more-click="showAction(item)"
      v-for="item in pagingLazy.list"
      :key="item.id"
      :item="item"
    ></ym-project-item>
    <ym-empty
      v-if="pagingLazy.isEmpty"
      text="暂无数据"
      type="search"
    ></ym-empty>
    <ym-load-more v-else :status="pagingLazy.loadStatus"></ym-load-more>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import {
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo
} from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import { operateConfirm } from '@/utils/commonUse'

const service = useService()

const keyword = ref('')

const pagingLazy = reactive(
  new PagingLazy(async function (page, size) {
    const result = await service.mine.queryProjectList({ page, size })
    return {
      total: result.total,
      records: result.records
    }
  })
)

onLoad(async function () {
  pagingLazy.load()
})

onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  pagingLazy.next()
})

const goDetail = async (id: string) => {
  uni.navigateTo({ url: `./detail?id=${id}` })
}

// 选择停止项目
const handleStopProject = async (item:any) => {
  if (item.status === 'stop') return false
  operateConfirm('停止项目', async () => {
    return await service.mine.updateProjectStatus({ id: item.id, status: 'stop' })
  }, function () {
    pagingLazy.refresh()
  })
}
// 判断是否可以停止项目
const canStopProject = async (item:any) => {
  // if (item.status === 'stop') return false
  const res = await service.mine.getProjectChangeCheck({ projectId: item.id })
  if (res) {
    uni.showModal({
      title: '提示',
      content: '项目正在变更审核中，请撤销后再停止项目！',
      showCancel: false
    })
  } else {
    handleStopProject(item)
  }
}

const goAccess = (item:any) => {
  uni.navigateTo({
    url: '/pages/mine/project/bp-access?showAll=' + bpInfo.showAll + '&bpId=' + item.id // 是否公开全部人（0、不公开；1、公开）
  })
}
const goAuth = (item:any) => {
  uni.navigateTo({
    url: '/pages/mine/project/bp-auth?confirm=' + bpInfo.confirmed + '&bpId=' + item.id + '&bpName=' + encodeURIComponent(bpInfo.bpName) // 是否已确权（0、未确权；1、已确权）
  })
}
const goInviteAuth = (item:any) => {
  uni.navigateTo({
    url: '/pages/features-page/inviteAuth?id=' + item.id // 是否已确权（0、未确权；1、已确权）
  })
}

const bpInfo:any = reactive({
  id: ''
})
//  查看项目BP
const getBpFileLast = async (id:string) => {
  const result = await service.collectBp.getBpFileLastest({
    id
  })
  Object.assign(bpInfo, result)
}

const showAction = async (item:any) => {
  await getBpFileLast(item.id)

  if (item.hasBp === 1) {
    if (item.status === 'stop') {
      uni.showActionSheet({
        itemList: ['已停止'],
        itemColor: '#333333'
      })
    } else {
      uni.showActionSheet({
        itemList: ['BP公开权限管理', '邀请确权', '确权人管理', '停止项目'],
        itemColor: '#333333',
        success: res => {
          switch (res.tapIndex) {
            case 0: goAccess(item); break
            case 1:goInviteAuth(item); break
            case 2:goAuth(item); break
            case 3:canStopProject(item); break
          }
        }
      })
    }
  } else {
    if (item.status === 'stop') {
      uni.showActionSheet({
        itemList: ['已停止'],
        itemColor: '#333333'
      })
    } else {
      uni.showActionSheet({
        itemList: ['邀请确权', '确权人管理', '停止项目'],
        itemColor: '#333333',
        success: res => {
          switch (res.tapIndex) {
            case 0:goInviteAuth(item); break
            case 1:goAuth(item); break
            case 2:canStopProject(item); break
          }
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped></style>
