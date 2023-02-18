<template>
  <view class="container">
    
    <!-- 顶部栏 -->
    <ym-navigation-bar :alpha="0" title="我的"></ym-navigation-bar>

    <!-- 背景图 -->
    <image class="mine-bg" :src="config.ADMIN_ASSETS_URL + 'mine-bg.png'"></image>

    <!-- 用户信息 -->
    <user-card :userInfo="userInfo" :type="type" @changeRole="handleChangeRole"></user-card>

    <!-- 企业信息 -->
    <role-card ref="roleRef" :userInfo="userInfo" :type="type" :userIdentity="userIdentity"></role-card>

    <!-- 用户菜单 -->
    <menu-card ref="menuRef" :userInfo="userInfo" :type="type" :subType="subType"></menu-card>
    
  </view>
</template>
<script lang="ts" setup>
import {ref,reactive, Ref} from 'vue'
import { onShow } from "@dcloudio/uni-app";
import { useService, setUserInfo, useConfig } from '@/plugins/app-core'
import { setSubToken, getPersonIdentity, getEnterpriseIdentity } from '@/utils/subToken'
import userCard from "./mine-info/user-card.vue";
import roleCard from "./mine-info/role-card.vue";
import menuCard from "./mine-info/menu-card.vue";

const service = useService()
const config = useConfig()

// 默认角色类型: 1 投资经理 2 投资机构 3 企业管理员 4 指导单位
let type: Ref<number> = ref(0)
let userInfo: any = ref({})
let userIdentity: any = reactive({})
let subType: Ref<number> = ref(0)
let roleRef = ref()
let menuRef = ref()

onShow(async () => {
  // 获取用户基本信息
  userInfo.value = await service.app.getUserInfo()
  setUserInfo(userInfo.value)

  // 判断用户权限并设置页面
  const personIdentity = await getPersonIdentity()
  const enterpriseIdentity = await getEnterpriseIdentity()
  !!personIdentity && (type.value = personIdentity.defaultRoleType)
  !!enterpriseIdentity && (type.value = enterpriseIdentity.defaultRoleType)
  !!enterpriseIdentity && (subType.value = enterpriseIdentity.defaultSecondaryRoleType) //是否子管理员

  userIdentity.personIdentity = personIdentity
  userIdentity.enterpriseIdentity = enterpriseIdentity
  menuRef.value.updateRelationId()
  roleRef.value.initData()
  
})

// 切换个人账号
const handleChangePerson = async () => {
  uni.showLoading({	title: '切换中' })
  setTimeout( async() => {
    if (Array.isArray(userInfo.value.personIdentity) &&  userInfo.value.personIdentity.length > 0) {
      // 切换投资经理
      await setSubToken(userInfo.value.personIdentity[0].subToken)
      type.value = 1
    } else {
      // 切换个人账号
      await setSubToken(null)
      type.value = 0
    }
    menuRef.value.updateSubRole()
    menuRef.value.updateRelationId()
    roleRef.value.initData()
    uni.hideLoading();
  }, 500)
}

const handleChangeRole = () => {
  if([0, 1].includes(type.value)){
    // 个人用户，切换为企业用户
    uni.navigateTo({ url: '/pages/mine/change-role' })
  }else{
    // 企业用户，切换为个人
    handleChangePerson()
  }
}

</script>

<style lang="scss" scoped>
.container{
  padding-bottom: 40rpx;
}
.mine-bg{
  width: 750rpx;
  height: 616rpx;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
