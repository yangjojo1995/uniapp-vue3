<template>
  <view class="page">
    <!-- 顶部栏 -->
    <ym-navigation-bar :alpha="alpha" title="首页"></ym-navigation-bar>

    <!-- 背景图 -->
    <image class="page-bg" :src="config.ADMIN_ASSETS_URL + 'index-bg.png'"></image>

    <!-- 企业 -->
    <view v-if="enterpriseIdentity" class="current-company">
      <view class="current-company__select" @click="changeIdentity">
        <text>{{ enterpriseIdentity.name }}</text>
      </view>
      <uni-icons class="uni-icons" type="bottom" size="14"></uni-icons>
      <view class="current-company__tags">
        <text>{{ enterpriseIdentity.defaultRoleTypeName }}</text>
        <text>{{ enterpriseIdentity.defaultSecondaryRoleTypeName }}</text>
        <!-- <text>管理员</text> -->
      </view>
    </view>

    <!-- Banner -->
    <ym-group v-if="bannerList.length > 0" :transparent="true" :containerPadding="24">
      <ym-swiper-image class="banner-swiper"
        :list="bannerList"
        :autoplay="true"
        :circular="true"
        :border-radius="12"
      ></ym-swiper-image>
    </ym-group>

    <!-- 导航 -->
    <view class="page-box page-grid">

      <view class="page-grid-group">
        <view class="page-grid-item" v-for="item in navList1" :key="item.text" @click="handleNavItemClick(item)">
          <image :src="item.icon"></image><text>{{item.text}}</text>
        </view>
      </view>

      <view class="page-grid-group">
        <view class="page-grid-item2" v-for="item in navList2" :key="item.text" @click="handleNavItemClick(item)">
          <image :src="item.icon"></image><text>{{item.text}}</text>
        </view>
      </view>

      <!-- <ym-grid-nav :list="navList1" @item-click="handleNavItemClick" :bottom="24"></ym-grid-nav>
      <ym-grid-nav :list="navList2" @item-click="handleNavItemClick" :imgWidth="72"></ym-grid-nav> -->
    </view>

    <!-- 公告 -->
    <view class="page-box" v-if="noticeList.length > 0">
      <ym-notice-rotation  @item-click="toNotice" :icon="noticeIcon" :list="noticeList"></ym-notice-rotation>
    </view>

    <!-- 推荐 -->
    <view class="page-box">
      <!-- 项目 -->
      <ym-page-home-paging-project v-if="roleType==1 || roleType==2"></ym-page-home-paging-project>

      <!-- 投资机构 -->
      <ym-page-home-paging-organization v-else></ym-page-home-paging-organization>
    </view>

    <!-- 返回顶部按钮 -->
    <u-back-top :scroll-top="alpha" :icon="backTopImg" :iconStyle="{width:'72rpx',height:'72rpx'}" :customStyle="{backgroundColor:'transparent'}"></u-back-top>

  </view>
</template>

<script setup lang="ts">
// http://vue3-hellouniapp.dcloud.net.cn/
// https://uniapp.dcloud.io/component/uniui/uni-ui.html

import { ref, reactive } from 'vue'
import { onShow, onLoad, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app'
import { useService, useRouter, getUserInfo, useConfig } from '@/plugins/app-core'
import { setSubToken, getPersonIdentity, getEnterpriseIdentity } from '@/utils/subToken'

import navIcon1 from '@/assets/index/nav_1.png'
import navIcon2 from '@/assets/index/nav_2.png'
import navIcon3 from '@/assets/index/nav_3.png'
import navIcon4 from '@/assets/index/nav_4.png'
import navIcon5 from '@/assets/index/nav_5.png'
import navIcon6 from '@/assets/index/nav_6.png'
import navIcon7 from '@/assets/index/nav_7.png'
import navIcon8 from '@/assets/index/nav_8.png'

import backTopImg from '@/assets/index/backtop.png'

import noticeIcon from '@/assets/index/notice_icon.png'

const router = useRouter()
const service = useService()
const config = useConfig()
// 公告列表
const noticeList = ref([])
// Banner 图片列表
const bannerList = ref([])
const enterpriseIdentity: any = ref()
const personIdentity: any = ref()

const checkMessage = async () => {
  const userInfo = await getUserInfo()
  if (!userInfo) return
  const res = await service.home.checkPopupMsg({ type: '1' })
  if (res) {
    const id = res.id
    // 返回非空，有弹窗待显示
    uni.showModal({
      title: '资料确认提醒',
      content: '平台运营者已为您创建预发布项目，请您确认',
      showCancel: true,
      confirmText: '去查看',
      success: async (res) => {
        if (res.confirm) {
          await service.home.popupOperate({ id, operate: 'yes' })
          uni.navigateTo({ url: '/pages/mine/project/project' })
        } else {
          service.home.popupOperate({ id, operate: 'no' })
        }
      }
    })
  }

  const res2 = await service.home.checkPopupMsg({ type: '2' })
  if (res2) {
    const id = res2.id
    uni.showModal({
      title: '修改密码提醒',
      content: '为了账号安全需尽快修改初始密码，现在去修改？',
      showCancel: true,
      confirmText: '去修改',
      success: async (res) => {
        if (res.confirm) {
          await service.home.popupOperate({ id, operate: 'yes' })
          uni.navigateTo({ url: '/pages/mine/setup' })
        } else {
          service.home.popupOperate({ id, operate: 'no' })
        }
      }
    })
  }
}

// 公告跳转
const toNotice = async (item: any) => {
  router.push({
    path: '/pages/announcement/list'
  })
}
// 下拉刷新
onPullDownRefresh(async () => {
  noticeList.value = await service.app.latestThree()
  bannerList.value = await service.home.bannerList()
})

const alpha = ref(0)
onPageScroll(async (e) => {
  alpha.value = e.scrollTop
})

const changeIdentity = async () => {
  router.push({ path: '/pages/mine/change-role' })
}

async function getRoleType () {
  personIdentity.value = await getPersonIdentity()
  enterpriseIdentity.value = await getEnterpriseIdentity()
  if (personIdentity.value && roleType.value !== personIdentity.value.defaultRoleType) {
    roleType.value = personIdentity.value.defaultRoleType
  }
  if (enterpriseIdentity.value && roleType.value !== enterpriseIdentity.value.defaultRoleType) {
    roleType.value = enterpriseIdentity.value.defaultRoleType
  }
}

const roleType = ref(0)
onShow(async function () {
  // 查看当前角色信息
  const getRoleData = getRoleType()

  // 广告列表
  const getBannerData = service.home.bannerList().then((res) => {
    bannerList.value = res
  })

  // 公告列表
  const getNoticeData = service.app.latestThree().then((res) => {
    noticeList.value = res
  })

  // 查看是否有通知弹窗
  const getMessageData = checkMessage()

  Promise.all([getRoleData, getBannerData, getNoticeData, getMessageData])
})
// 导航列表
const navList1 = reactive([
  { icon: navIcon1, text: '投资机构', url: '/pages/organization/home' },
  { icon: navIcon2, text: '投资经理', url: '/pages/manager/home' },
  { icon: navIcon3, text: '指导单位', url: '/pages/observer/home' },
  { icon: navIcon4, text: '投盟链', appId: 'wx5cabab0542a9574a', url: '' }
])
const navList2 = reactive([
  { icon: navIcon5, text: '企业', url: '/pages/company/home' },
  { icon: navIcon6, text: '项目池', url: '/pages/project/home' },
  { icon: navIcon7, text: '数据看板', url: '/pages/about/board' },
  { icon: navIcon8, text: '关于我们', url: '/pages/about/detail' }
])

// 导航点击事件
const handleNavItemClick = (item: any) => {
  if (item.appId) {
    uni.showModal({
      title: '温馨提示',
      content: '"壹启投盟"、"乡产投盟"是不同行业领域的投资联盟链，如主动申请加入“壹启投盟”，注册验证后可跨联盟同步信息。',
      success: res => {
        if (res.confirm) {
          return uni.navigateToMiniProgram({ appId: item.appId, path: item.url })
        }
      }
    })
  } else {
    return router.push(item.url)
  }
}

</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
  }

  .page-header{
    height: 100rpx;
    width: 100%;
    overflow: hidden;

    .page-header-title{
      font-size: 28rpx;
      font-weight: 500;
      color: #000000;
      text-align: center;
      height: 30rpx;
      line-height: 30rpx;
      margin-top: 70rpx;
    }
  }

  .page-bg{
    width: 100%;
    height: 1420rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -10;
  }

  .current-company {
    box-sizing: border-box;
    padding: 12rpx 32rpx 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &__select {
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
      line-height: 36px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    &__tags {
      flex: 1 1 auto;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      line-height: 24rpx;
      white-space: nowrap;
      text-align: right;
      text {
        margin-left: 8rpx;
        padding-right: 8rpx;
        border-right: 1px solid #e5e5e5;
        &:last-child {
          padding-right: 0;
          border-right: none;
        }
      }
    }
  }

  .banner-swiper {
    display: block;
    overflow: hidden;
  }

  .page-box{
    width: 702rpx;
    border-radius: 12rpx;
    background: #fff;
    margin: 0 24rpx 24rpx;
  }

  .page-grid{
    padding: 30rpx 24rpx;
    box-sizing: border-box;
  }

  .page-grid-group{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .page-grid-item{
    width: 110rpx;
    height: 154rpx;
    text-align: center;
    image{
      width: 110rpx;
      height: 110rpx;
    }
    text{
      font-weight: 400;
      color: #333333;
      font-size: 24rpx;
    }
  }

  .page-grid-item2{
    margin-top: 40rpx;
    width: 110rpx;
    height: 128rpx;
    text-align: center;
    image{
      width: 80rpx;
      height: 80rpx;
    }
    text{
      font-weight: 400;
      color: #333333;
      font-size: 24rpx;
      display: inline-block;
      width: 100%;
    }
  }

  .group-grid{
    ::v-deep.group__container{
      padding-top: 16rpx;
      padding-bottom: 0;
    }
  }

  .credibility {
    white-space: nowrap;
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 42rpx;
    letter-spacing: 1rpx;
    text {
      margin-left: 6rpx;
    }
  }

  .text-primary {
    color: #00c682;
  }
</style>
