<template>
  <view>
    <ym-group v-if="data.content" type="info">
      <view class="content" v-html="data.content"></view>
    </ym-group>
    <ym-empty v-if="!data.title" text="暂无数据" mode="list"></ym-empty>
  </view>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    data() {
      return {
        shareOptions: {},
      }
    },
    async onLoad(props: any) {
      const title = '关于我们'
      const result: any = await this.$service.app.aboutInfo({ title })
      this.shareOptions = {
        title: result.title,
        path: undefined,
        imageUrl: undefined,
      }
    },
  })
</script>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useService, useRouter } from '@/plugins/app-core'
  import { onLoad } from '@dcloudio/uni-app'
  import CONFIG from '@/config'
  import assets from '@/utils/assets'
  import time from '@/utils/time'
  const service = useService()
  const router = useRouter()

  const data = reactive({
    createTime: '',
    title: '',
    id: '',
    content: '',
  })

  onLoad(async (props) => {
    const title = '关于我们'
    const result = await service.app.aboutInfo({ title })
    Object.assign(data, result)
    //图片替换大小,补足域名
    if (data.content) {
      data.content = data.content.replace(
        /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
        (match, p1) => {
          return `<img src='${
            p1.indexOf('http') > -1 ? p1 : CONFIG.ASSETS_BASE_URL + p1
          }' />`
        }
      )
      data.content = data.content.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto" '
      )
    }
  })
  const submits = async () => {}
</script>

<style lang="scss" scoped>
  .header {
    padding: 60rpx 0;
    background: #ffffff;
    margin-bottom: 20rpx;
    &__icon {
      display: block;
      width: 128rpx;
      height: 128rpx;
      background: #f2f2f2;
      margin: 0 auto;
      border-radius: 50%;
      margin-bottom: 24rpx;
      overflow: hidden;
    }
    &__name {
      font-size: 34rpx;
      font-weight: 500;
      color: #333333;
      line-height: 34rpx;
      text-align: center;
      margin-bottom: 10rpx;
    }
    &__desc {
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
      line-height: 36rpx;
      letter-spacing: 1rpx;
      text-align: center;
      margin-bottom: 25rpx;
    }
    &__btns {
      text-align: center;
    }
  }
  .content {
    font-size: 26rpx;
  }
  .footer-btn {
    width: 686rpx;
    height: 82rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: 500;
    margin: 0 8rpx;
  }
  .green-bg {
    background: $--ym-bg-primary;
    color: #fff;
  }
  .text-primary {
    color: #00c682;
  }

  .header-btn {
    display: inline-block;
    width: 226rpx;
    height: 82rpx;
    background: #f8f8f8;
    border-radius: 41rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
    line-height: 82rpx;
    letter-spacing: 1rpx;
    user-select: none;
    &:active {
      opacity: 0.8;
    }
    &--primary {
      color: #00c682;
      background: #e7f8f2;
    }
    & + .header-btn {
      margin-left: 14rpx;
    }
  }

  .field {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20rpx;
    word-break: break-word;
    margin-top: -30rpx;
    &:last-child {
      margin-bottom: 0;
    }
    &__label {
      white-space: nowrap;
      padding-right: 60rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
      line-height: 40rpx;
      letter-spacing: 1rpx;
    }
    &__value {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      line-height: 40rpx;
      letter-spacing: 1rpx;
      text-align: right;
    }
    &__value2 {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      line-height: 40rpx;
      letter-spacing: 1rpx;
    }
  }

  .header-icon {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
