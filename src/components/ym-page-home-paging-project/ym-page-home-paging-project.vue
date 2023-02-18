<template>
  <ym-group
    title="项目推荐"
    header-right-text="查看更多"
    :container-padding="containerPadding"
    @header-right-click="router.push({ path: '/pages/project/home' })"
  >
    <ym-project-item
      :isIndex="true"
      @item-click="handlePagingLazyClick(item)"
      v-for="item in pagingLazy.list"
      :key="item.id"
      :item="item"
    ></ym-project-item>
    <!-- <ym-list-item
      v-for="(item) in pagingLazy.list"
      :key="item.id"
      :thumb="assets(item.image)"
      :name="item.projectName"
      :tag="item.industryDict.itemName"
      :content="item.description"
      :content-lines="3"
      :thumb-lazy-load="true"
      :clickable="true"
      tag-type="info"
      thumb-mode="aspectFit"
      @click="handlePagingLazyClick(item)">
    </ym-list-item> -->
    <ym-empty
      v-if="pagingLazy.isEmpty"
      text="暂无数据"
      type="search"
    ></ym-empty>
    <ym-load-more v-else :status="pagingLazy.loadStatus"></ym-load-more>
  </ym-group>
</template>

<script setup lang="ts">
  // http://vue3-hellouniapp.dcloud.net.cn/
  // https://uniapp.dcloud.io/component/uniui/uni-ui.html

  import { reactive } from 'vue'
  import { onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
  import { useService, useRouter } from '@/plugins/app-core'
  import { PagingLazy } from '@/utils/paging'
  import assets from '@/utils/assets'

  const router = useRouter()
  const service = useService()

  const containerPadding = 0

  // 推荐分页
  const pagingLazy = reactive(new PagingLazy(async function (page, size) {
    const { total, records }  = await service.home.getRecommendProjectRecord({ page, size })
    return { total, records }
  }))


  // 推荐项点击事件
  const handlePagingLazyClick = async(item: any)=> {
    await service.project.projectView({ id:item.id })
    router.push({ path: '/pages/project/detail', query: { id: item.id } })
  }

  // 上拉加载
  pagingLazy.load()
  onReachBottom(() => pagingLazy.next())

  // 下拉刷新
  onPullDownRefresh(async () => {
    await pagingLazy.refresh()
    uni.stopPullDownRefresh();
  })
</script>

<style lang="scss" scoped>
  .page {
    background-color: #ffffff;
    min-height: 100vh;
  }

  .banner-swiper {
    display: block;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #F7F7F7;;
  }


  .text-primary {
    color: #00c682;
  }
</style>
