<template>
  <view class="page">
    <ym-search-bar
      v-model="search"
      clickable
      clearButton="none"
      :sticky="true"
      @click="router.back()"
    ></ym-search-bar>

    <div class="page-list">
      <ym-project-item
        @item-click="handleClick(item)"
        :projectPool="true"
        v-for="item in listPagingLazy.list"
        :key="item.id"
        :item="item"
      ></ym-project-item>
    </div>

    <ym-empty
      v-if="listPagingLazy.isEmpty"
      text="暂无数据"
      type="search"
    ></ym-empty>
    <ym-load-more v-else :status="listPagingLazy.loadStatus"></ym-load-more>
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
  import {
    useService,
    useConfig,
    useRouter,
    setToken,
    setUserInfo,
  } from '@/plugins/app-core'
  import { PagingLazy } from '@/utils/paging'
  import assets from '@/utils/assets'
  const router = useRouter()
  const service = useService()

  const search = ref('')

  // 项目推荐分页
  const listPagingLazy = reactive(
    new PagingLazy(async function (page, size) {
      const { total, records } = await service.project.getProjectRecord({
        page,
        size,
        projectName: search.value,
      })
      return { total, records }
    })
  )

  onLoad(async (query) => {
    search.value = decodeURIComponent(query.search || '')
    listPagingLazy.load()
  })

  onPullDownRefresh(async () => {
    await listPagingLazy.refresh()
    uni.stopPullDownRefresh()
  })

  onReachBottom(() => {
    listPagingLazy.next()
  })

  const handleClick = async (item: any)=> {
    await service.project.projectView({id:item.id})
    router.push({ path: '/pages/project/detail', query: { id: item.id } })
  }
</script>

<style lang="scss" scoped>
  .page-list {
    margin-top: 20rpx;
  }
</style>
