<template>
  <view class="ym-card" style="padding: 0 24rpx; width: auto;">
    <view class="group-item" :class="{border: index!==0}" v-for="(item,index) in optionsList" :key="index" @click="handleClick(item)">
      <view class="flex jc-between ai-center">
        <image :src="item.icon" class="u-m-r-30 icon-wrap"></image>
        <text class="fs-28 text-color-primary flex-grow-1">{{item.label}}</text>
        <image :src="arrowIcon" class="arrow"></image>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref,reactive, Ref, watch} from 'vue'
import { onShow } from "@dcloudio/uni-app";
import { useService, setUserInfo } from '@/plugins/app-core'
import { setSubToken, getPersonIdentity, getEnterpriseIdentity } from '@/utils/subToken'
import arrowIcon from '../../assets/mine/arrow.png'
import projectIcon from '@/assets/mine/project.png'
import relationIcon from '@/assets/mine/relation.png'
import ruleIcon from '@/assets/mine/rule.png'
import inviteIcon from '@/assets/mine/invite.png'
import accountIcon from '@/assets/mine/account.png'
import subAccountIcon from '@/assets/mine/subAccount.png'
import searchIcon from '@/assets/mine/search.png'
import activityIcon from '@/assets/mine/activity.png'
import infoIcon from '@/assets/mine/info.png'
import collectIcon from '@/assets/mine/collect.png'
import likeIcon from '@/assets/mine/like.png'

const props = withDefaults(defineProps<{
  type: number
  subType: number
  userInfo: any
}>(), {

})

interface menuType {
  label: string,
  icon: string,
  url: string,
  role: Array<number>,
	excludeSubRole: Array<number>
}
let optionsList: Ref<Array<menuType>> =ref([])
const menuList: Array<menuType> = [
  {
      label: '投盟公约',
      icon: ruleIcon,
      url: '/pages/mine/rule',
      role: [0, 1, 2, 3, 4],
			excludeSubRole: []
  },{
      label: '关系图谱',
      icon: relationIcon,
      url: '/pages/mine/relation',
      role: [0, 1, 2, 3, 4],
			excludeSubRole: [] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  },{
      label: '我的项目',
      icon: projectIcon,
      url: '/pages/mine/project/project',
      role: [1, 2, 3, 4],
			excludeSubRole: [] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  },{
      label: '活动管理',
      icon: activityIcon,
      url: '/pages/mine/activity/activity-manage',
      role: [1, 2, 3, 4],
			excludeSubRole: [] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  },
  {
      label: '申请记录',
      icon: searchIcon,
      url: '/pages/application/list',
      role: [1,2,3,4],
			excludeSubRole: [1] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  }, 
   {
    label: '资料管理',
    icon: infoIcon,
    url: '/pages/mine-identity/manager/info',
    role: [1],
		excludeSubRole: []
  },
  {
    label: '资料管理',
    icon: infoIcon,
    url: '/pages/mine-identity/organization/info',
    role: [2],
		excludeSubRole: [] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号

  },
  {
    label: '资料管理',
    icon: infoIcon,
    url: '/pages/mine-identity/enterprise/info',
    role: [3],
		excludeSubRole: [] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号

  },
	{
    label: '资料管理',
    icon: infoIcon,
    url: '/pages/mine-identity/observer/info',
    role: [4],
		excludeSubRole: []  	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  },
	{
      label: '办事子账号管理',
      icon: subAccountIcon,
      url: '/pages/mine-identity/account-manage/account-list',
      role: [2, 3,4],
			excludeSubRole: [1] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  },  
	{
      label: '投资经理管理',
      icon: accountIcon,
      url: '/pages/mine-identity/organization-manage/manager-list',
      role: [2],
			excludeSubRole: [1] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  },
  {
      label: '点评与点赞',
      icon: likeIcon,
      url: '/plugins/app-comment/packages/my-comment/my-comment',
      role: [1, 2, 3, 4],
			excludeSubRole: [] 	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  },
  {
      label: '收藏夹',
      icon: collectIcon,
      url: '/pages/mine/collectProject/list',
      role: [1, 2,3,4],
			excludeSubRole: []
  },
  {
    label: '邀请好友',
    icon: inviteIcon,
    url: '/pages/mine/invite',
    role: [0, 1, 2, 3, 4],
    excludeSubRole: [1] //	// excludeSubRole  代表排除  0代表管理员  1代表子账号
  }
]

watch(() => props.type, function () {
  updateSubRole()
  updateRelationId
})

onShow(async () => {
  updateSubRole()
})

// 初始化或切换身份后更新菜单
function updateSubRole(){
  optionsList.value = menuList.filter( (item) => {
		// item.excludeSubRole  代表排除  0代表管理员  1代表子账号
    return item.role.includes(props.type) && !item.excludeSubRole.includes(props.subType)
  })
}

// 切换身份后更新关系图谱传入id
async function updateRelationId(){
  let id: any = ""
  if([2, 3, 4].includes(props.type)){
    // 企业机构
    const enterpriseIdentity = await getEnterpriseIdentity()
    id = enterpriseIdentity?.representativeId
  }else{
    const personIdentity = await getPersonIdentity()
    id = personIdentity?.representativeId || props.userInfo.userId
  }
  menuList[1].url = '/pages/mine/relation?id=' + (id || props.userInfo.userId)
}

const handleClick = function (item: any) {
  uni.navigateTo({	url: item.url}) 
}

defineExpose({
  updateSubRole,
  updateRelationId
})

</script>

<style scoped lang="scss">
.group-item {
  padding: 32rpx 0;
}

.border{
  border-top: 1rpx solid #eee;
}
  
.icon-wrap{
  width:44rpx;
  min-width:44rpx;
  height:44rpx;
}
</style>
