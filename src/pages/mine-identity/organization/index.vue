<template>
  <view class="my-base-card">
    <view class="action-list u-p-x-26 bg-white u-m-b-20 u-m-t-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" v-if="type!='update'" @click="goIdentity">资质认证
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content">
        <view class="flex jc-between">
          <text class="text-color-third fs-28 label">单位名称</text>
          <text class="text-color-secondary fs-28">{{params.fullName}}</text>
        </view>
      </view>
    </view>
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goBase">基本信息
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content" v-if="params.shortName? true: false">
        <view class="flex jc-between u-m-b-32 ai-center">
          <text class="text-color-third fs-28 label">机构简称</text>
          <view class="flex-1 flex jc-end">
            <image :src="fullLogo" class="logo"></image>
          </view>
          <text class="text-color-secondary fs-28">
            {{params.shortName}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">单位性质</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.nature}} {{params.detailNature}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">注册资本金(万元)</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.registeredCapital}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">成立时间</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{time.formatTimeDate(params.foundTime)}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">从业人员数量</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.practitionerNum}}</text>
        </view>
        <view class="flex jc-between  u-m-b-32">
          <text class="text-color-third fs-28 label">业务规模</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.businessScale}}</text>
        </view>
        <view class="flex jc-between">
          <text class="text-color-third fs-28 label">单位地址</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.address}}</text>
        </view>
      </view>

    </view>
    <!-- 投资偏好 -->
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goFavor">投资偏好
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content" v-if="params.investment? true: false">
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">关注地区</text>
          <view class="text-color-secondary fs-28 value flex-1 text-right">
            {{ mapJoin(params.focusAreas, 'cityIdStr') }}
          </view>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">投资领域</text>
          <view class="text-color-secondary fs-28 value flex-1 text-right">
            {{ mapJoin(params.investFieldsStr, 'itemName') }}
          </view>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">投资轮次</text>
          <view class="text-color-secondary fs-28 value flex-1 text-right">
            {{ mapJoin(params.investRoundsStr, 'itemName') }}
          </view>
        </view>
        <view class="flex jc-between">
          <text class="text-color-third fs-28 label">单笔投额</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.investment}}</text>
        </view>
      </view>
    </view>
    <!-- 所属区域 -->

    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary  u-p-y-48" @click="goLoaction">
        <text class="bold u-m-r-10">所属区域</text>
        <text class="fs-28 text-color-third flex-1">(通过地图找到你)</text>
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content" v-if="params.location?params.location.address: ''">
        <view class="flex ai-center">
          <image class="edit" src="../../../assets/certification/location.png" />
          <text class="text-color-secondary fs-28 u-m-l-20">{{params.location ?params.location.address: '' }}</text>
        </view>
      </view>

    </view>

    <!--  法定代表人-->
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goLeagal">法定代表人
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content" v-if="params.legalRepresentativeName?true: false">
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">姓名</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.legalRepresentativeName}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">职务</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.legalRepresentativePosition}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">联系电话</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.legalRepresentativePhone}}</text>
        </view>
      </view>

    </view>

    <!--  联系人-->
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goCharge">单位联系人
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content" v-if="params.contactName?true: false">
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">姓名</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactName}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">职务</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactPosition}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">联系电话</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactPhone}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label ">通讯地址</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactAddress}}</text>
        </view>
        <view class="flex jc-between  u-m-b-32">
          <text class="text-color-third fs-28 label ">联系邮箱</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactEmail}}</text>
        </view>
      </view>

    </view>

    <!-- 单位简介 -->
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goIntroduce">单位简介
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="action-content u-p-b-50" v-if="params.introduction">
        <ym-project-collsage :showExpand="true" :nopadding="true" :content="params.introduction"></ym-project-collsage>
      </view>
    </view>
    <!-- 荣誉简介 -->
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goHonr">荣誉奖励
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="action-content u-p-b-50" v-if="params.honor">
        <ym-project-collsage :showExpand="true" :nopadding="true" :content="params.honor"></ym-project-collsage>
      </view>
    </view>
    <!-- 荣誉简介 -->
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goBusiness">营业执照或申请表（签章）
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="picture flex ai-center u-p-y-50 action-content flex-wrap" v-if="params.stampImage&&params.stampImage.length>0">
        <view class="pic" v-for="item,index in params.stampImage" :key="index">
          <image :src="assets(item)" @tap="previewImage(item)" class="img" mode="widthFix"></image>
        </view>
      </view>
    </view>
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary  u-p-y-48" @click="goRule">
        <text class="bold u-m-r-10">自我承诺签名</text>
        <text class="text-color-third fs-24 introduce flex-1 flex">
          (请阅读乡产投盟公约并承诺签名)
        </text>
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="picture flex ai-center u-p-y-50 action-content" v-if="fullSignature">
        <view class="pic">
          <image :src="fullSignature" @tap="previewImage(fullSignature)" class="img"></image>
        </view>
      </view>
    </view>

    <view class="fs-24 text-color-secondary obey">
      <view class="flex ai-center u-p-32 agree" @tap="agreeFlag = !agreeFlag">
        <view class="checked u-m-r-4" :class="agreeFlag == false? '':'selected'"></view>
        <view class="u-m-l-8">同意将以上资料同步于投盟链</view>
      </view>
    </view>
    <view class="footer-wrap fs-32">
      <view class="footer-inner">
        <view class="next-btn" @click="goSubmit">提交</view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  onPullDownRefresh,
  onReachBottom,
  onLoad,
  onShow
} from '@dcloudio/uni-app'
import {
  router,
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo
} from '@/plugins/app-core'
import { setSubToken } from '@/utils/subToken'
import assets from '@/utils/assets'
import time from '@/utils/time'
const agreeFlag = ref(false)
const fullLogo = ref('')
const unionId = ref('')
const type = ref('') // update 代表从切换身份过来
const fullStampImage = ref('')
const fullSignature = ref('')
const service = useService()
const config = useConfig()
const params: any = reactive({})

const subToken = ref('')

let isSubmit = false

const images = reactive([{ url: 'https://cdn.seovx.com/ha/?mom=302&t=2' }])

function mapJoin (array: Array<{ [key: string]: any }>, key: string) {
  if (array !== null && array.length !== 0) {
    return array.map((item) => item[key]).join('、')
  } else {
    return ''
  }
}
const goRule = () => {
  uni.navigateTo({
    url: './agreement?unionId=' + unionId.value
  })

  // uni.navigateTo({
  //   url: '/pages/mine/rule?unionId='+unionId.value+ '&from=organization'
  // })
}
const goIntroduce = () => {
  uni.navigateTo({
    url: './introduce?unionId=' + unionId.value
  })
}
const goHonr = () => {
  uni.navigateTo({
    url: './honr?unionId=' + unionId.value
  })
}
const goBase = () => {
  uni.navigateTo({
    url: './base?unionId=' + unionId.value
  })
}
const goIdentity = () => {
  uni.navigateTo({
    url:
      '/pages/mine/identity/company?unionId=' +
      unionId.value +
      '&from=organization'
  })
}
const goFavor = () => {
  uni.navigateTo({
    url: './favor?unionId=' + unionId.value
  })
}
const goLeagal = () => {
  uni.navigateTo({
    url: './legalperson?unionId=' + unionId.value
  })
}
const goCharge = () => {
  uni.navigateTo({
    url: './chargeperson?unionId=' + unionId.value
  })
}
const goBusiness = () => {
  uni.navigateTo({
    url: './businescope?unionId=' + unionId.value
  })
}
const goLoaction = () => {
  uni.authorize({
    scope: 'scope.userLocation',
    success: () => {
      uni.chooseLocation({
        success: async (res) => {
          await service.certification.addOrganizationDraft({
            id: unionId.value,
            location: {
              name: res.name,
              address: res.address,
              latitude: res.latitude,
              longitude: res.longitude
            }
          })
        },
        fail: (e) => {
          console.log('scope.userLocation报错')
          console.log(e)
        }
      })
    },
    fail: () => {
      uni.showModal({
        title: '授权提示',
        content: '需要同意小程序使用地理定位',
        success: () => {
          uni.openSetting({})
        }
      })
    }
  })
}
const getOrganizationDetail = async () => {
  const result = await service.certification.getOrganizationDetail({
    id: unionId.value
  })
  Object.assign(params, result)
  if (result !== null && result !== undefined) {
    fullLogo.value = result.logo ? config.ASSETS_BASE_URL + result.logo : '' // 补全图片
    // fullStampImage.value =  result.stampImage?config.ASSETS_BASE_URL +  result.stampImage : ''// 补全图片
    fullSignature.value = result.signature
      ? config.ASSETS_BASE_URL + result.signature
      : '' // 补全图片
  }
}

const goSubmit = async () => {
  if (!agreeFlag.value) {
    uni.showToast({
      icon: 'none',
      title: '请勾选同意将以上资料同步于投盟链'
    })
    return
  }
  if (isSubmit) {
    return false
  }
  isSubmit = true
  uni.showLoading({})
  try {
    if (type.value === 'update') {
      const result = await service.certification.confirmOrganization({
        id: unionId.value
      })
      const userInfo = await service.app.getUserInfo()
      await setUserInfo(userInfo)

      await setSubToken(subToken.value)
      setTimeout(() => {
        uni.hideLoading()
        uni.redirectTo({
          url: '/pages/mine-identity/organization/certification-state'
        })
        isSubmit = false
      }, 500)
    } else {
      const result = await service.certification.addOrganization({
        id: unionId.value
      })
      setTimeout(() => {
        uni.hideLoading()
        uni.redirectTo({
          url: '/pages/mine/certification-state?unionId=' + unionId.value
        })
        isSubmit = false
      }, 500)
    }
  } catch (error) {
    isSubmit = false
  }
}

const previewImage = (url: string) => {
  url = assets(url)
  uni.previewImage({
    current: url + '?original=true',
    urls: [url + '?original=true']
  })
}
onLoad(async (options) => {
  unionId.value = options.unionId || ''
  // type = update 代表从切换身份过来
  type.value = options.type || ''
  subToken.value = options.subToken || ''
  if (type.value === 'update') {
    uni.setNavigationBarTitle({
      title: '确认资料'
    })
  }
})
onShow(() => {
  getOrganizationDetail()
})
</script>

<style lang="scss" scoped>
.action-list {
  border-radius: 12rpx;
  .action-text {
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .action-value {
    max-width: 520rpx;
    min-width: 520rpx;
    word-break: break-all;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .action-content {
    border-top: 1rpx solid #ece7e3;
  }
  .action-title {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .edit {
      width: 36rpx;
      height: 36rpx;
      min-width: 36rpx;
    }
  }
  .action-item {
    border-bottom: 1rpx solid #ece7e3;
    &:last-child {
      border-bottom: 1rpx solid transparent;
    }
  }
}
.action-icon {
  max-width: 42rpx;
  min-width: 42rpx;
  height: 42rpx;
}
.theme-color {
  color: #12c287;
}

.min-height {
  height: unset !important;
  .introduce {
    padding-top: 20rpx;
  }
}
.obey {
  border-radius: 12rpx;
}
.agree {
  background-color: #fff2de;
  color: #ff9f00;
}
.default-agree {
  background-color: #dcdcdc;
}
.head-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  overflow: hidden;
  max-width: 70rpx;
  min-width: 70rpx;
}

.label {
  min-width: 120rpx;
}
.value {
  word-break: break-all;
  text-align: right;
  letter-spacing: 1rpx;
}
.value-item {
  padding: 0 16rpx;
  position: relative;
  &:after {
    content: "";
    width: 1rpx;
    height: 20rpx;
    background-color: #c6c6c6;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &:last-child {
    padding-right: 0;
  }
}
.no-content {
  &:after {
    content: none;
  }
}

.picture {
  .pic {
    position: relative;
    margin-right: 32rpx;
    .img {
      max-width: 162rpx;
      min-width: 162rpx;
      height:108rpx;
      border-radius: 6rpx;
      overflow: hidden;
      display: block;
    }
    .del-icon {
      width: 32rpx;
      height: 32rpx;
      position: absolute;
      top: -16rpx;
      right: -16rpx;
    }
  }
}
.logo {
  min-width: 74rpx;
  width: 74rpx;
  height: 74rpx;
  border-radius: 50%;
  display: block;
  margin-right: 20rpx;
}
.edit {
  width: 36rpx;
  height: 36rpx;
  min-width: 36rpx;
}

.agree {
  background-color: #fff2de;
  color: #ff9f00;
}
.checked {
  width: 26rpx;
  height: 26rpx;
  border: 2rpx solid #ff9f00;
  position: relative;
  border-radius: 50%;
}
.selected {
  &:after {
    content: "";
    width: 12rpx;
    height: 12rpx;
    background: #ff9f00;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
