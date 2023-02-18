<template>
  <view class="content" style="
      background: url(https://gdxctm.cn/business/static/file/蒙版_06239ca5245a4cf9840190d08ae6c094_183190a6c97946cfbe8fc37e151d5b43.png)
        no-repeat;
      background-size: 100% 100%;
    ">
    <view class="voucher bg-white fs-24 u-p-b-40">
      <view class="fs-34 bold u-p-t-40 u-p-b-12 flex ai-center jc-center block-name">{{ sourceVo.shortName }}
      </view>
      <view class="text-color-third u-m-b-24 flex ai-center jc-center">乡产投盟区块链凭证</view>
      <view class="u-m-b-24 flex u-p-x-64">
        <text class="text-color-third u-m-r-24">数字身份</text>
        <view class="text-color-secondary">{{sourceVo.digitalIdentity}}</view>
      </view>
      <view class="u-m-b-24 flex u-p-x-64" :class="{ 'is-expand': expandPublicKey }" @click="showPublicKey(sourceVo.publicKey)">
        <text class="text-color-third u-m-r-24">身份公钥</text>
        <view class="text-color-secondary">{{ sourceVo.publicKey }}</view>
      </view>
      <view class="flex u-p-x-64">
        <text class="text-color-third u-m-r-24">存证时间</text>
        <view class="text-color-secondary">{{datetime(sourceVo.authTime)}}</view>
      </view>
      <image src="../../assets/relation/chain.png" class="chain-img" />
    </view>
    <movable-area class="move-area" :scale-area="true">
      <movable-view class="move-view" :x="x" :y="y" direction="all" scale="true" out-of-bounds="true" animation="true"
        scale-max="1.3" scale-min="0.2">
        <view class="move-item">
          <view v-for="(item, index) in dataArr" :key="index" class="tab" :style="{
            transform:
              'rotate(' + item.deg + 'deg) translateX(' + item.x + 'px)',
          }">
            <view v-if="item.direction == 'source'" class="arrow1" :class="[
              item.direction === 'source' ? 'ask' : '',
              index % 2 ? 'color-blue' : '',
            ]" />
            <!-- direction方向source表示当前这个是发送方，target表示当前是接收方	 -->
            <view class="line" :style="{ width: item.lineW + 'rpx' }">
              {{ item.typeStr }}
            </view>
            <view v-if="item.direction == 'target'" class="arrow1" :class="[
              item.direction === 'target' ? 'assist' : '',
              index % 2 ? 'color-blue' : '',
            ]" />
            <view class="top-btn" :style="{ transform: 'rotate(-' + item.deg + 'deg)' }" @click="tabTo(item)">
              <image :src="assets(item.icon)" v-if="item.icon"
                :style="{ width: item.wh + 'rpx', height: item.wh + 'rpx' }" />
              <image class="icon" :src="avatar" :style="{ width: item.wh + 'rpx', height: item.wh + 'rpx' }" v-else />
              <view class="user-name" :style="{ fontSize: item.fontSize + 'rpx' }">
                {{ item.shortName }}
              </view>
            </view>
          </view>
          <view class="wrap">
            <view class="icon-cell">
              <view class="border">
                <image class="icon" :src="assets(sourceVo.icon)" v-if="sourceVo.icon" />
                <image class="icon" :src="avatar" v-else />
              </view>
            </view>
            <view class="fs-30 text-color-primary text-center bold w160">{{
                sourceVo.shortName
            }}</view>
          </view>
        </view>
      </movable-view>
    </movable-area>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import {
  useService,
  useConfig,
  useRouter,
  getUserInfo,
} from '@/plugins/app-core'
import assets from '@/utils/assets'
import { datetime } from '@/utils/dayjs'

let dataArr: any = reactive([])
let sourceVo: any = reactive({})
let x = ref(-(750 / 2))
let y = ref(-620)

const representativeId = ref('')
const avatar = ref(
  'https://gdxctm.cn/business/static/file/微信图片_20220429181948_b7931adc4d3e45069f2ce60b96e29c9a.png'
)
const service = useService()


const getData = async () => {
  try {
    const result = await service.user.getRelation({
      representativeId: representativeId.value,
    })
    dataArr = [...dataArr, ...result.targetVos]
    sourceVo = Object.assign(sourceVo, result.sourceVo)
    initChart()
  } catch (error) { }
}

// 关系图谱
const initChart = () => {
  if (!dataArr) {
    return false
  }
  const arr: any = []
  let deg = 360 / dataArr.length
  const d = Math.ceil(dataArr.length / 8) * 90
  const maxwidth = uni.getSystemInfoSync().screenHeight * 1.5
  for (let i = 0; i < dataArr.length; i++) {
    let fontSize = 22
    const wh = Number(Math.random() * 80 + 68)
    let lineW: number = Number(Math.random() * d + 140) // 边界
    lineW =
      lineW > Number(maxwidth - 120) ? Number(maxwidth - 120) : Number(lineW) // 边界
    console.log(lineW)
    if (wh <= 68) {
      fontSize = 22
    } else if (wh <= 88) {
      fontSize = 26
    } else {
      fontSize = 28
    }

    let x = 0
    if (deg * i - 20 > 0 && deg * i - 20 < 180) {
      x = 20
    }
    dataArr[i] = Object.assign(dataArr[i], {
      x: x,
      wh: wh,
      fontSize: fontSize,
      deg: deg * i - 20,
      lineW: lineW,
    })
  }
}
const tabTo = (item: any) => {
  // 角色类型0普通用户1投资经理2投资机构3企业4指导单位
  let url = ''
  switch (item.roleType) {
    case 0:
      // url = '/pages/'
      break
    case 1:
      url =
        '/pages/manager/detail?id=' +
        encodeURIComponent(item.representativeId)
      break
    case 2:
      url =
        '/pages/organization/detail?id=' +
        encodeURIComponent(item.representativeId)
      break
    case 3:
      url =
        '/pages/company/detail?id=' +
        encodeURIComponent(item.representativeId)
      break
    case 4:
      url =
        '/pages/observer/detail?id=' +
        encodeURIComponent(item.representativeId)
      break
  }
  if (url) {
    uni.navigateTo({
      url: url
    })
  }
}

const expandPublicKey = ref(false)
const showPublicKey = (key: string) => {
  // return uni.showModal({
  //   title: '身份公钥',
  //   content: key
  // })
  expandPublicKey.value = !expandPublicKey.value
}

onLoad((params) => {
  representativeId.value = params.id ? params.id : ''
  getData()
})
</script>

<style lang="scss" scoped>
.voucher {
  position: absolute;
  left: 0;
  top: 20rpx;
  z-index: 10;
  width: 100%;
  overflow: hidden;

  .block-name {
    width: 100%;
    text-align: center;
  }

  .item {
    color: rgba(255, 255, 255, 0.8);
    line-height: 40rpx;
    word-break: break-all;

    .code {
      display: inline-block;
      width: 470rpx;
      vertical-align: top;
    }
  }

  .bgImg {
    position: absolute;
    top: 0;
    right: 0;
    width: 159rpx;
    height: 125rpx;
  }
}

.content {
  height: 100vh;
  width: 100%;
}

.w160 {
  width: 160rpx;
}

.move-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}

.icon-cell {
  box-shadow: 0px 0px 0px 20px rgba(0, 198, 130, 0.08);

  border-radius: 50%;

  .border {
    background-color: #fff;
    padding: 10rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 0px 10px rgba(18, 194, 135, 0.12);
  }

  .icon {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    position: relative;
    border: 4rpx solid rgba(0, 198, 130, 1);
  }
}

.top-btn {
  position: relative;
  text-align: center;
  font-weight: bold;

  image {
    border-radius: 50%;
    border: 2rpx solid #66eaff;
  }

  .user-name {
    position: absolute;
    left: 50%;
    bottom: -30rpx;
    transform: translateX(-50%);
    min-width: 120rpx;
    font-size: 24rpx;
    color: #333;
  }
}

.move-view {
  width: 300%;
  height: 300%;
  box-sizing: border-box;

  .move-item {
    position: relative;
    width: 100%;
    height: 100%;

    .tab {
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      align-items: center;
      transform-origin: left center;

      image {
        box-shadow: 0px 5rpx 6rpx 0px rgba(18, 194, 135, 0.35);
        border: 4rpx solid #00c682;
      }

      .line {
        position: relative;
        height: 2rpx;
        text-align: right;
        padding-right: 46rpx;
        padding-left: 46rpx;
      }

      .arrow1 {
        width: 0rpx;
        height: 0rpx;
        border-radius: 4rpx;

        &.ask {
          margin-left: 100rpx;
          border-top: 12rpx solid transparent;
          border-right: 16rpx solid rgba(0, 198, 130, 1);
          border-bottom: 12rpx solid transparent;

          &.color-blue {
            border-right: 16rpx solid rgba(0, 198, 130, 1);
          }
        }

        &.assist {
          border-top: 12rpx solid transparent;
          border-left: 16rpx solid rgba(0, 198, 130, 1);
          border-bottom: 12rpx solid transparent;

          &.color-blue {
            border-left: 16rpx solid rgba(0, 198, 130, 1);
          }
        }
      }
    }
  }
}

.bg {
  height: 100%;
  width: 100%;
}

.line {
  color: #333;
  font-size: 22rpx;
  border-bottom: 4rpx solid rgba(0, 198, 130, 1);
}

.chain-img {
  width: 140rpx;
  height: 114rpx;
  position: absolute;
  right: 0;
  top: -10rpx;
}


.text-color-third {
  white-space: nowrap;
}

.text-color-secondary  {
  flex: 1 1 auto;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-line;
  box-sizing: border-box;
  
  $line: 2;
  $line-height: 32rpx;

  font-size: 24rpx;
  font-weight: 400;
  color: #666666;
  max-height: ($line-height * $line);
  line-height: $line-height;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  white-space: pre-wrap;
}

.is-expand .text-color-secondary {
  display: block;
  height: initial;
  height: unset;
  max-height: initial;
  max-height: unset;
}
</style>
