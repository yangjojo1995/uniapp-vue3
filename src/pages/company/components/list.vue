<template>
  <view>
    <view class="page-list">
      <ym-list-card v-for="(item) in listPagingLazy.list" :key="item.id"
       :icon="item.avatar ? false : '../../assets/project/default.png'"
       :thumb="item.avatar"
       :name="item.shortName"
       @click="handleClick(item)">
        <template #content>
          <view class="list-item-content" v-if="item.belongIndustryStr">{{ item.belongIndustryStr }} | {{ item.belongProvinceStr }}{{ item.belongCityStr }}</view>
          <view class="list-item-content" v-if="item.summary">{{ item.summary }}</view>
        </template>
      </ym-list-card>
    </view>

    <ym-empty v-if="listPagingLazy.isEmpty" text="暂无数据"></ym-empty>
    <ym-load-more v-else :status="listPagingLazy.loadStatus"></ym-load-more>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRouter, getUserInfo } from '@/plugins/app-core'

const router = useRouter()

const props = withDefaults(defineProps<{
  listPagingLazy: any
}>(), {
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: Event): void
}>()

const userInfo = ref()
onLoad(async () => {
  userInfo.value = await getUserInfo()
})
const handleClick = function (item: any) {
  if (!userInfo.value) {
    return uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) router.push('/pages/login/login')
      }
    })
  }
  router.push({ path: '/pages/company/detail', query: { id: item.id } })
}

</script>

<style lang="scss" scoped>

  .list-item-content {
    $line: 1;
    $line-height: 40rpx;

    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
    max-height: ($line-height * $line);
    line-height: $line-height;
    display: -webkit-box;
    -webkit-line-clamp: $line;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
    white-space: pre-wrap;
    margin-bottom: 8rpx;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .list-item-title {
    $line: 1;
    $line-height: 40rpx;

    font-size: 26rpx;
    font-weight: 400;
    max-height: ($line-height * $line);

    display: flex;
    align-items: center;

    margin-bottom: 8rpx;
    text {
      display: -webkit-box;
      -webkit-line-clamp: $line;
      -webkit-box-orient: vertical;
      line-height: $line-height;
      overflow: hidden;
      word-break: break-word;
      white-space: pre-wrap;
      max-width: 80%;
    }
    &:last-child {
      margin-bottom: 0;
    }
    image {
      width: 119rpx;
      height: 32rpx;
      margin-left: 10rpx;
    }
  }
  .credibility {
    white-space: nowrap;
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 42rpx;
    display: flex;
    align-items: center;
    
    .text-primary{
      font-size: 30rpx;
      font-weight: 600;
      color: #00BB3B;
      margin-right: 16rpx;
    }
  }

  .text-primary {
    color: $--ym-color-primary;
  }
</style>
