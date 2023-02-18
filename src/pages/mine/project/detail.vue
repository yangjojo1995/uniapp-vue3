<template>
  <view v-if="projectBase.projectName">

    <ym-project-detail 
      :projectBase="projectBase"
      :projectMembers="projectMembers"
      :projectProduct="projectProduct"
      :authenticInfo="authenticInfo"
      :projectCompany="projectCompany"
      :financeList="financeList"
      :commentInfo="commentInfo"
      :myProject="true">
      </ym-project-detail>

    <view style="width: 100%; height: 108rpx"></view>
    <ym-footer v-if="bpInfo.id || commentInfo.status">
      <view class="flex ai-center  jc-between footer-box">
        <!-- <view class="flex-1 flex ai-center" :class="bpInfo.id? '': 'jc-center'">
          <view class="c-btn fs-24 text-color-primary  text-center"   v-if="bpInfo.id" @click="goAccess">
            <view >
              <image class="c-icon" src="../../../assets/mine/c-access.png" ></image>
            </view>
            <text>BP授权管理</text>
          </view>
          <view class="c-btn fs-24 text-color-primary  text-center" v-if="bpInfo.id" @click="goAuth">
            <view >
              <image class="c-icon" src="../../../assets/mine/c-auth.png"></image>
            </view>
            <text>BP确权管理</text>
          </view>
          <view class="c-btn fs-24 text-color-primary  text-center" @click="handleStopProject" >
            <view >
              <image class="c-icon" src="../../../assets/mine/c-delete.png"></image>
            </view>
            <text>{{projectBase.status == 'stop'? '已停止': '停止项目'}}</text>
          </view>
        </view> -->
        <!-- <view class="look-btn u-p-x-56 u-p-y-24" @click="handleDeleteProject" v-if="projectBase.status == 'draft'">
          删除项目
        </view>
        <view class="look-btn u-p-x-56 u-p-y-24" @click="handlePublishProject" v-if="projectBase.status == 'pre-publish'">
          确认发布
        </view> -->
        <view 
          v-if="commentInfo.status" 
          class="flex-1 add-comment-btn u-p-x-56 u-p-y-24 u-m-r-8 flex ai-center jc-center" 
          @click="toAddComment">
            写点评
        </view>
        <view class="flex-1 look-btn u-p-x-56 u-p-y-24" v-if="bpInfo.id" @click="downloadHandle">查看BP</view>
      </view>
    </ym-footer>
  </view>
</template>

<script setup lang="ts">
import { projectDetail } from '@/service/mine'
import { reactive, onLoad, onShow, useService, operateConfirm, ref } from '@/utils/commonUse'

const service = useService()
/** *********** 项目详情 begin ************/

// 项目基本信息
const projectBase: any = reactive({ id: '' })

// 项目产品信息
const projectProduct: any = reactive({})

// 企业信息
const projectCompany: any = reactive({})

// 财务信息
const financeList:any = reactive([])

// 团队成员
const projectMembers: object = reactive([])
const bpInfo:any = reactive({
  id: ''
})

// 评论权限信息
const commentInfo:any= reactive({
  status: false,
  commentNum: 0,
  msg: ''
})


let projectId = ref('')
const authenticInfo:any = reactive([])
onLoad(async (options: Record<string, string | undefined>) => {
  if (typeof options.id !== 'string') {
    uni.showToast({ title: '项目id值非法' })
    console.log({ optionsId: options.id })
    return
  }
  projectId.value = options.id
  // 根据id获取项目详情
  const result: projectDetail = await service.mine.getProjectDetail({ id: options.id })
  Object.assign(projectBase, result.projectBase)
  Object.assign(projectProduct, result.projectProduct)
  Object.assign(projectMembers, result.projectMembers)
  Object.assign(projectCompany, result.projectCompany)
  getBpFileLast()
  if (projectCompany?.id) {
    getFinance(projectCompany.id)
  }

  const assignResult = await service.mine.bpAssistRecord({ id: options.id })
  Object.assign(authenticInfo, assignResult)
})

onShow(async function () {
  await commentAuth()
  await commentTotal()
})

// 依据项目id查询是否可以进行点评
 const commentAuth = async ()=>{
  const result = await service.project.commentAuth({ bindId: projectId.value})
  commentInfo.status = result.status
  commentInfo.msg = result.msg
 }

 // 获取点评总数
 const commentTotal = async ()=>{
  const result = await service.project.commentTotal({ bindId: projectId.value})
  commentInfo.commentNum = result.commentNum
 }
 // 去评论
const toAddComment = async ()=>{
  await commentAuth()
  if(!commentInfo.status){
     uni.showToast({
      icon: 'none',
      title: commentInfo.msg || '点评已关闭',
      duration: 1000
    })
    return
  }
  
  uni.navigateTo({ url: `/plugins/app-comment/packages/form/create?bindId=${projectId.value}&bindType=0` })
}

/** *********** 项目详情 end ************/

/** ***** 项目操作：删除、停止、编辑等 begin *********/

// 点击停止按钮
const handleStopProject = async () => {
  if (projectBase.status === 'stop') return false
  operateConfirm('停止项目', async () => {
    return await service.mine.updateProjectStatus({ id: projectBase.id, status: 'stop' })
  }, function () {
    uni.navigateTo({ url: './project' })
  })
}

// 点击删除按钮
const handleDeleteProject = async () => {
  operateConfirm('删除项目', async () => {
    return await service.mine.deleteProjectStatus({ id: projectBase.id })
  }, function () {
    uni.navigateTo({ url: './project' })
  })
}

// 点击发布项目
const handlePublishProject = async () => {
  operateConfirm('发布项目', async () => {
    return await service.mine.updateProjectStatus({ id: projectBase.id, status: 'publish' })
  }, function () {
    uni.navigateTo({ url: './project' })
  })
}
/** ***** 项目操作：删除、停止、编辑等 end *********/

/** *********** 页面绑定事件 begin ***************/

//  查看项目BP
const getBpFileLast = async () => {
  const result = await service.collectBp.getBpFileLastest({
    id: projectBase.id
  })
  Object.assign(bpInfo, result)
}

// 获取项目公司最近三年的财务数据
const getFinance = async (id:string) => {
  const res = await service.mine.getProjectFinance({ projectCompanyId: id })

  const list = []

  if (res && res.length > 0) {
    const year = res.map((item:any) => item.year)
    year.unshift('项目/年度')

    const totalAssets = res.map((item:any) => item.totalAssets)
    totalAssets.unshift('资产总额')

    const income = res.map((item:any) => item.income)
    income.unshift('营业收入')

    const netAssets = res.map((item:any) => item.netAssets)
    netAssets.unshift('净资产')

    const netProfit = res.map((item:any) => item.netProfit)
    netProfit.unshift('净利润')

    const debt = res.map((item:any) => item.debt)
    debt.unshift('负债')

    const debtRatio = res.map((item:any) => item.debtRatio + '%')
    debtRatio.unshift('资产负债率')

    const netCashFlow = res.map((item:any) => item.netCashFlow)
    netCashFlow.unshift('现金流量净额')

    list.push(year, totalAssets, income, netAssets, netProfit, debt, debtRatio, netCashFlow)
  }

  Object.assign(financeList, list)
  console.log('financeList')
  console.log(financeList)
}

let downloadDisable = false
const downloadHandle = async () => {
  if (downloadDisable) return
  downloadDisable = true
  const res = await service.collectBp.getBpFile({ bpId: bpInfo.id })
  downloadDisable = false
  if (Array.isArray(res.pictures) && res.pictures.length > 0) {
    uni.navigateTo({
      url: '/pages/project/bpFile?bpId=' + bpInfo.id
    })
  } else {
    uni.showToast({ title: '转换中，请稍候', icon: 'none' })
  }
}

const goAccess = () => {
  uni.navigateTo({
    url: '/pages/mine/project/bp-access?showAll=' + bpInfo.showAll + '&bpId=' + bpInfo.id // 是否公开全部人（0、不公开；1、公开）
  })
}
const goAuth = () => {
  uni.navigateTo({
    url: '/pages/mine/project/bp-auth?confirm=' + bpInfo.confirmed + '&bpId=' + bpInfo.id + '&bpName=' + encodeURIComponent(bpInfo.bpName) // 是否已确权（0、未确权；1、已确权）
  })
}

/** ********** 页面绑定事件 end ***************/

</script>

<style lang="scss" scoped>
.footer-box{
  width: 686rpx;
}
.c-btn{
  margin-right: 38rpx;
}
.c-icon{
  width:42rpx;
  height:42rpx;
}
.look-btn{
  background: $--ym-bg-primary;
  border-radius: 50rpx;
  color:#fff;
  font-size:32rpx;
  text-align: center;
}
.add-comment-btn{
  background: #fff;
  border: 1px solid $--ym-color-primary;
  border-radius: 50rpx;
  color: $--ym-color-primary;
  font-size:32rpx;
}

</style>
