<template>
  <view class="sign">
    <view class="sign-bg"></view>
    <view class="sign-group" v-for="(item) in listPagingLazy.list" :key="item.id" @click="goDetail(item.id, item.accountRole)">
      <!-- <view class="bg"></view> -->
      <image :src="assets(item.signature)" mode="widthFix"></image>
      <view class="create-time fs-20">{{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}</view>
    </view>
    <ym-empty class="whole" v-if="listPagingLazy.isEmpty" text="暂无数据" type="search"></ym-empty>
    <ym-load-more class="whole" v-else :status="listPagingLazy.loadStatus"></ym-load-more>
  </view>
</template>

<script lang="ts" setup>
import { reactive, onLoad, useService } from '@/utils/commonUse'
import { PagingLazy } from '@/utils/paging'
import dayjs from 'dayjs'
import { useRouter } from '@/plugins/app-core'
import { onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
const router = useRouter()

import assets from '@/utils/assets'
const service = useService()

const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.mine.getSignatureList({ page, size})
  return { total, records }
}))
listPagingLazy.size = 36

onLoad(async (query) => {
  listPagingLazy.load()
})

onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh();
})

onReachBottom(() => {
  listPagingLazy.next()
})

const goDetail = (id: string, accountRole: number) => {
  if (accountRole === 2) {
    router.push({ path: '/pages/organization/detail', query: { id } })
  } else if (accountRole === 3) {
    router.push({ path: '/pages/company/detail', query: { id } })
  } else if (accountRole === 4) {
    router.push({ path: '/pages/observer/detail', query: { id } })
  } else if (accountRole === 1) {
    router.push({ path: '/pages/manager/detail', query: { id } })
  }
}


</script>

<style lang="scss">
.sign {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20rpx 32rpx;
  box-sizing: border-box;

  .sign-bg{
    background-image: url('../../../assets/mine/paperBg.jpg');
    background-repeat: repeat;
    height: 100vh;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .sign-group{
    width: 32%;
    margin: 0 0 20rpx;
    padding:12rpx 0;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    // background-color:#fff;
    border-radius: 8rpx;
    position:relative;
    .bg{
      width:76rpx;
      height:76rpx;
      position: absolute;
      top:12rpx;
      right:12rpx;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA5CAMAAABUBBiJAAAANlBMVEUAAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAACuAAAgSRhdAAAAEnRSTlMATAUPGhVGJgkiQio2Mj0uHjqkXAqrAAAELklEQVRIx5VVV6LjIBCzmEYv97/sYvBLNomzZX5iDEIapODja5GweDr+q8ii4izNUoN4908oaQbUZp2NLVBSaJS/Q0kQTSiUWINxM+6BLWOUP0Mpau6erfCW5zxJG+zEEPkPuAKVHgO97u6JsnEd4r/SIU22uynPIXGWfotjBaX2rRWX2JLQHQ7RK/22chb9LloyF4SPjWUkqf5HWe9WOFjJhflBIzaR9oZ0o3h1P881pKE5QnWYUOkX1FNIub/iZLh4PVq1AsTJxb0FGzGGdCHd4QLkxYdxxM3nq2QoP1LmiJnOkcvrJJxW/8QF7XmvFCVoePfpnADS6pOQnkIReS+mbMj+xowC1SXS2JSegbka9Fom3U0lqBOsboy0PAiz7U2iId3AMnOsdMQ16QuP6wAaXN0LBPkuioAwSkVeJnaTcBFWXoTUoJ+wLocUowQ1QZzJoW5Y6wWimzBBPk5loEyLYFTMxBTTyi4qu/Fj/TpG/AgipvgiUPDsyB/ezpdUxzlpcbttDHqjI4BpgoRUS8MjeRz9/C3NttLx1uHIR5s8SHNf08W6yqUOP/HNjSuk+ZUvo0qEImhyrsKvlytoAfNcubi0b6nc3+wDpBor4mxU2lIZVlMBE5LgFzAx3JPtXGQVMTY0pNKuTPN6ID7DU5Rt5Y71GfoZ+WxOAASU8Yhh8LyAZn4KUtmHmh6MltUAEAFKNQ/0S0d1a4kI08m4Ry3rBlJTBVBQfa2opfj26NpoM4YxAdH7JaNdjBUE4DTChNMMzrNQ1kg41qkLRNv/dAlFjmORgqa6+sQ5pLzi62KZTOgLweTOV4UENUx0zYI4Zb38TVjW1i7b5EUPy6Kl8symInuvdqT37DY4txnBi79N0IIOYIYkYfqr9Qj6lt0qbbtC8BNYC/EaoimCR3AhK0+290vbKe9QisdqzpxMugFogK4jEa2o77hpXKelzI0dIJUZBNaalBLAGCd7/sARkm2lrsi+2rLI4RoYRlVdgc3R8VFQ3kdhg3/uPuvuoBoLakcvwHFTGVz2g0P6aZpO8awWMOLE8g2uI13mGD8yweb7xCes/56T2yuyM20zPR59OGM6D7YitFQ+USte1ydVWOEeQK6SJlI0X9fRq38MTVn2jI4n4ckVpbi58d4saXveIsIRZpGu8MTXS1tCskAXUwg5Zp9K6pYaEGMf7eLO4xW3VFqQi993Jzw0qsZYODWjH0sS3o/ciVaqv32GLeeWmLl4/8yq4cYqSuyZnmNPQl1+F4UREe6sGiPIlPulakw6cXfFWls3uoP6kAOAb7uSISYJRP7t5FLyBbOOr8UZcepN3rtdcw9O3ZEC+o3wSslQLeQnq/Vg0siRWUQ1jv34c7mColqZvA+eQgUiRHy0469FEkqN2jRqnrEXZosrdP9Szq+6Mh/Xxfj/5fgzML8A2Jwl3gS2EmkAAAAASUVORK5CYII=');
      background-repeat: no-repeat;
      background-size: 76rpx 76rpx;
      background-position: center center;
    }
    image{
      width: 160rpx;
      height: 100rpx;
    }
  }

  .whole{
    width: 100%;
  }
}

</style>