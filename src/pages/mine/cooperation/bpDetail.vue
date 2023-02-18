<template>
  <view v-if="projectBase.projectName">

    <!-- 项目状态为停止时，不显示项目以及操作 -->
    <ym-empty v-if="projectBase && projectBase.status==='stop'" title="很抱歉，此项目已停止" type="stop"></ym-empty>

    <template v-else>
      <ym-project-detail
      :projectBase="projectBase"
      :projectMembers="projectMembers"
      :projectProduct="projectProduct"
      :authenticInfo="authenticInfo"
      :projectCompany="projectCompany"
      :commentInfo="commentInfo"
      :financeList="financeList"
      :applyStatus="applyStatus"></ym-project-detail>

      <div style="width: 100%; height: 108rpx"></div>
      <ym-footer v-if="status==='assisting' || status==='assisted'">
        <view class="flex ai-center jc-between footer-box">
          
          <view class="flex-1 flex ai-center" :class="bpInfo.id? '': 'jc-center'" v-if="status==='assisting'">
            <!-- <view class="c-btn fs-24 text-color-primary  text-center" @click="toggleCollect">
              <view >
                <image class="c-icon" src="../../../assets/mine/c-d.png" v-if="collected == 0"></image>
                <image class="c-icon" src="../../../assets/mine/c-a.png" v-else></image>
              </view>
              <text>{{collected == 1?'已收藏':'收藏BP'}}</text>
            </view> -->
       
            <view class="c-btn fs-24 text-color-primary  text-center" @click="handleAssist">
              <view >
                <image class="c-icon" src="../../../assets/mine/c-auth.png"></image>
              </view>
              <text>帮TA确权</text>
            </view>
          </view>
<!--           <view 
            v-if="commentInfo.status" 
            class="flex-1 add-comment-btn u-p-x-56 u-p-y-24 u-m-r-8 flex ai-center jc-center" 
            @click="toAddComment">
              写点评
          </view> -->
          <view v-if="bpInfo.id"  class="flex-1 look-btn u-p-x-56 u-p-y-24" @click="downloadHandle">查看BP</view>
        </view>
      </ym-footer>
    </template>
  </view>
</template>

<script setup lang="ts">
import { projectDetail } from '@/service/mine'
import { ref, reactive, onLoad, onShow, useService } from '@/utils/commonUse'

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

// 收藏状态
const collected: any = ref(-1)

const authenticInfo:any = reactive([])

// 确权状态
const status: any = ref('')

let projectId = ref('')
onLoad(async (options: any) => {
  
  projectId.value = options.bindId

  // 查看确权状态
  const getStatus = service.mine.getAssistStatus({ assistId: options.assistId }).then((assistData) => {
    status.value = assistData.status
  })

  // 根据id获取项目详情
  const getProject: any = service.mine.getProjectDetail({ id: options.bindId }).then((result: projectDetail) => {
    Object.assign(projectBase, result.projectBase)
    Object.assign(projectProduct, result.projectProduct)
    Object.assign(projectMembers, result.projectMembers)
    Object.assign(projectCompany, result.projectCompany)
    // 已撤销和已失效不能查看财务
    if (status.value !== 'revoke' && status.value !== 'invalid' && projectCompany?.id) {
      getFinance(projectCompany.id)
    }
  })

  // 获取bp详情
  const getBp = service.collectBp.getBpFileLast({ id: options.bindId }).then((result) => {
    Object.assign(bpInfo, result)
    collected.value = bpInfo.collected
  })

  // 获取确权流程
  const getAssign = service.mine.bpAssistRecord({ id: options.bindId }).then((assignResult) => {
    Object.assign(authenticInfo, assignResult)
  })

  Promise.all([getStatus, getProject, getBp, getAssign])
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
}
/** *********** 项目详情 end ************/

/** *********** 页面绑定事件 begin ***************/
const goAccess = () => {
  uni.navigateTo({
    url: '/pages/mine/project/bp-access?showAll=' + bpInfo.showAll + '&bpId=' + bpInfo.id // 是否公开全部人（0、不公开；1、公开）
  })
}
const goAuth = () => {
  uni.navigateTo({
    url: '/pages/mine/project/bp-auth?confirm=' + bpInfo.confirmed + '&bpId=' + bpInfo.id // 是否已确权（0、未确权；1、已确权）
  })
}

const handleAssist = () => {
  uni.showModal({
    title: '温馨提示',
    content: '确定为项目进行确权吗？',
    showCancel: true,
    confirmText: '确定',
    success: async (res) => {
      if (res.confirm) {
        const data = await service.mine.bpAssist({ bindId: projectBase.id })
        if (data) uni.showToast({ title: '确权成功' })
        setTimeout(() => { uni.navigateBack({}) }, 800)
      }
    }
  })
}

let downloadDisable = false
const downloadHandle = async () => {
  if (downloadDisable) return
  downloadDisable = true
  try {
    const res = await service.collectBp.getBpFile({ bpId: bpInfo.id })
    downloadDisable = false
    uni.navigateTo({
      url: '/pages/project/bpFile?bpId=' + bpInfo.id
    })
  } catch (msg) {
    downloadDisable = false
    uni.showToast({ title: '授权已被取消', icon: 'none' })
    setTimeout(() => { uni.navigateBack({}) }, 800)
  }
}

// 收藏BP
const toggleCollect = async () => {
  const { collected: collectedData } = await service.collectBp.toggleCollect({
    id: bpInfo.id,
    collected: collected.value // BP的收藏状态（要收藏时传0，取消收藏时传1）
  })
  if (collectedData != null) {
    collected.value = collectedData
    if (collectedData === 1) {
      uni.showToast({
        title: '已收藏，可在BP收藏夹查看',
        icon: 'none'
      })
    }
  }
}

/** ********** 页面绑定事件 end ***************/

</script>

<style lang="scss" scoped>
.footer-box{
  width: 686rpx;
}

.c-btn{
  margin-right: 38rpx;
  width: 120rpx;
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
