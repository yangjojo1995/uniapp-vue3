<template>
  <view :class="{ 'is-hide': !hasIdentity }">

    <!-- 项目状态为停止时，不显示项目以及操作 -->
    <ym-empty v-if="projectBase && projectBase.status==='stop'" title="很抱歉，此项目已停止" type="stop"></ym-empty>

    <template v-else>
      <ym-project-detail :projectBase="projectBase"
                        :identity="!hasIdentity"
                        :projectMembers="projectMembers"
                        :projectProduct="projectProduct"
                        :authenticInfo="authenticInfo"
                        :projectCompany="projectCompany"
                        :financeList="financeList"
                        :commentInfo="commentInfo"
                        :applyStatus="applyStatus"
                        @finance-apply="financeApplyConfirm"></ym-project-detail>
      <view style="width: 100%; height: 108rpx"></view>

      <view class="wrap" v-if="projectBase && projectBase.id && !hasIdentity">
        <view  class="is-hide-blur" :style="projectBase.description?.length > 100 && projectBase.projectName?.length > 17? 'height: calc(100vh - 820rpx)' : 'height: calc(100vh - 660rpx)'">
          <view class="is-hide-blur__bg"></view>
          <view class="is-hide-blur__wrap">
            <view>
              <text class="is-hide-blur__wrap__text">温馨提示：</text>
              <text class="is-hide-blur__wrap__text">基于项目方及资方的信息安全及信赖，只有认证投资人身份后可查看更多项目信息。</text>
            </view>
            <view class="is-hide-blur__button">
              <ym-button type="primary" @click="router.push('/pages/mine/certification')">去认证身份</ym-button>
            </view>
          </view>
        </view>
      </view>
      <template v-else>
        <ym-footer >
          <view class="flex ai-center footer-box">
            <view class="flex ai-center">
              <view class="c-btn fs-24 text-color-primary  text-center" @click="toggleCollect" >
                <view >
                  <!-- collected  是否有收藏：0无；1有 -->
                  <image class="c-icon2" src="../../assets/mine/c-d.png" v-if="collected == 0"></image>
                  <image class="c-icon2" src="../../assets/mine/c-a.png" v-else></image>
                </view>
                <text>{{collected == 1?'已收藏':'收藏'}}</text>
              </view>
            </view>
            <view v-if="theirProject" class="flex ai-center">
              <view class="c-btn fs-24 text-color-primary text-center" @click="sayHello" >
                <view >
                  <image class="c-icon" src="../../assets/project/chat.png"></image>
                </view>
                <text>私聊</text>
              </view>
            </view>

            <view v-if="commentInfo.status" class="flex-1 add-comment-btn u-p-x-56 u-p-y-24 u-m-r-8 flex ai-center jc-center" @click="toAddComment">
              写点评
            </view>
            <view v-if="bpInfo.id" class="flex-1 look-btn u-p-x-56 u-p-y-24 u-m-l-8 flex ai-center jc-center" @click="downloadHandle">
              查看BP
            </view>
          </view>
        </ym-footer>
      </template>
    </template>
  </view>
</template>

<script setup lang="ts">
import { projectDetail } from '@/service/mine'
import { getPersonIdentity, getEnterpriseIdentity } from '@/utils/subToken'
import { reactive, onLoad, onShow, useService, ref } from '@/utils/commonUse'
import { useRouter } from '@/plugins/app-core'
import { getIdentity } from '@/utils/subToken'

const router = useRouter()
const service = useService()

const hasIdentity = ref(false)
onShow(async function () {
  const personIdentity = await getPersonIdentity()
  const enterpriseIdentity = await getEnterpriseIdentity()
  hasIdentity.value = !!(enterpriseIdentity || personIdentity)
  if (enterpriseIdentity?.defaultRoleTypeName === '企业') {
    hasIdentity.value = false
  }
  await commentAuth()
  await commentTotal()
})

/** *********** 项目详情 begin ************/
// 项目基本信息
const projectBase: any = reactive({ id: '' })

// 项目产品信息
const projectProduct: any = reactive({})

// 团队成员
const projectMembers: any = reactive([])

// 企业信息
const projectCompany: any = reactive({})

const year = (new Date()).getFullYear()
// 财务信息
const financeList:any = reactive([
  ['项目/年度', year - 1, year - 2, year - 3],
  ['资产总额', '0.00', '0.00', '0.00'],
  ['营业收入', '0.00', '0.00', '0.00'],
  ['净资产', '0.00', '0.00', '0.00'],
  ['净利润', '0.00', '0.00', '0.00'],
  ['负债', '0.00', '0.00', '0.00'],
  ['资产负债率', '0.00', '0.00', '0.00'],
  ['现金流量净额', '0.00', '0.00', '0.00']])

const bpInfo:any = reactive({
  id: ''
})

// 评论权限信息
const commentInfo:any= reactive({
  status: false,
  commentNum: 0,
  msg: ''
})

// 团队成员
const authenticInfo:any = reactive([])

// 收藏状态
const collected: any = ref(-1)

const enterpriseIdentity: any = ref()
const personIdentity: any = ref()
const roleId = ref(0)
async function getRoleId () {
  personIdentity.value = await getPersonIdentity()
  enterpriseIdentity.value = await getEnterpriseIdentity()
  if (personIdentity.value && roleId.value !== personIdentity.value.representativeId) {
    roleId.value = personIdentity.value.representativeId
  }
  if (enterpriseIdentity.value && roleId.value !== enterpriseIdentity.value.representativeId) {
    roleId.value = enterpriseIdentity.value.representativeId
  }
}

let projectId = ref('')
let theirProject = ref(false)
// 优化项目详情载入速度，由300ms提升至150ms
onLoad(async (options: Record<string, string | undefined>) => {
  if (typeof options.id !== 'string') {
    uni.showToast({ title: '项目id值非法' })
    return
  }
  projectId.value = options.id

  // 查看当前角色信息
  await getRoleId()

  // 根据id获取项目详情
  const getProject: any = service.mine.getProjectDetail({ id: options.id }).then((result: projectDetail) => {
    Object.assign(projectBase, result.projectBase)
    Object.assign(projectProduct, result.projectProduct)
    Object.assign(projectMembers, result.projectMembers)
    Object.assign(projectCompany, result.projectCompany)
    collected.value = projectBase.collected
    // 如果是当前用户的项目，直接可以查看财务情况，无需申请财务权限
    if (roleId.value !== projectBase.publisher && projectBase?.id) {
      theirProject.value = true
      financePermission(projectBase.id)
    } else{
      if (projectCompany?.id) {
        getFinance(projectCompany.id)
      }
    }
  })

  // 获取bp详情
  const getBp = service.collectBp.getBpFileLast({ id: options.id }).then((result) => {
    console.log('有获取bp详情的收藏')
    Object.assign(bpInfo, result)
  })

  // 获取确权详情
  const getAssign = service.mine.bpAssistRecord({ id: options.id }).then((assignResult) => {
    Object.assign(authenticInfo, assignResult)
  })

  Promise.all([getProject, getBp, getAssign])
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

// 收藏项目
const toggleCollect = async () => {
  const { collected: collectedData } = await service.collectBp.toggleCollect({
    id: projectBase.id,
    collected: collected.value // 项目的收藏状态（要收藏时传0，取消收藏时传1）
  })
  if (collectedData != null) {
    collected.value = collectedData
    if (collectedData === 1) {
      uni.showToast({
        title: '已收藏，可在收藏夹查看',
        icon: 'none'
      })
    }
  }
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
    uni.showModal({
      title: '查看申请',
      content: '确定向项目发布方申请查看BP吗？',
      success: async res => {
        if (res.confirm) {
          const result = await service.collectBp.applyBpAuth({ projectId: projectBase.id })
          uni.navigateTo({
            url: '/pages/project/success'
          })
        }
      }
    })
  }
}

// 查看财务状况

const applyStatus = ref('3')
let financeAppllying = false

// 检查是否有权限查看财务数据
const financePermission = async (id:string) => {
  const result = await service.project.financePermission({ projectId: id })
  if (result.needApply && result.applyStatus !== '3') {
    applyStatus.value = result.applyStatus
  } else {
    applyStatus.value = '3'
    if (projectCompany?.id) {
      getFinance(projectCompany.id)
    } else {
      Object.assign(financeList, [])
    }
  }
}

const financeApplyConfirm = async () => {
  if (financeAppllying) return
  financeAppllying = true
  if (applyStatus.value === '1') {
    uni.showModal({
    // title: '',
      content: '您已申请，请等待审核通过。',
      showCancel: false
    })
  } else {
    uni.showModal({
      title: '查看申请',
      content: '确定向项目发布方申请查看财务状况吗？',
      success: async res => {
        if (res.confirm) {
          await service.project.financeApply({ projectId: projectBase.id })
          financeAppllying = false
          uni.navigateTo({
            url: '/pages/project/success?type=finance'
          })
        }
      }
    })
  }

  financeAppllying = false
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

// 私聊
const sayHello = async () => {
  if (!await getIdentity()) {
    uni.showModal({
      title: '认证提示',
      content: '该权限需要先认证身份，你要现在就去认证吗',
      confirmText: '去认证',
      cancelText: '再等等',
      success (res) {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/mine/certification' })
        }
      }
    })
  } else {
    uni.navigateTo({ url: `/pages/message/chat?contact=${projectBase.publisherInfo.id}` })
  }
}

</script>

<style lang="scss" scoped>
.footer-box{
  width: 686rpx;
}
.wrap {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
  position: relative;
  top: -20rpx;
}

.btn {
  padding: 25rpx 106rpx;
  border-radius: 60rpx;
  border: 1rpx solid #0073FF;
  text-align: center;
  width: 100%;
}

.stop-btn {
  border: 1rpx solid #E9E9E9;
  color: #333
}

.delete-btn {
  border: 1rpx solid #FF4536;
  color: #FF5744
}

.end-btn {
  padding: 25rpx 102rpx;
  border-radius: 60rpx;
  background: #E9E9E9;
  color: #fff;
  text-align: center;
}

.is-hide {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .is-hide-blur {
    display: block;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 50vh;
    height: calc(100vh - 600rpx);
    overflow: hidden;

    &__bg {
      position: absolute;
      left: -50%;
      top: -50%;
      z-index: 1;
      width: 200%;
      height: 200%;
      backdrop-filter: blur(4rpx);
      background-color: rgba(255, 255, 255, 0.8);
    }

    &__wrap {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 68rpx 0;
      font-size: 26rpx;
      font-weight: 400;
      color: #333333;
      line-height: 37rpx;
      text-align: center;

      text:first-child {
        color: #666666;
      }
    }
  }
}

.is-hide .is-hide-blur__wrap{
  padding: 68rpx 32rpx;
  .is-hide-blur__wrap__text{
    color: #333;
  }
}

.is-hide-blur__button {
  width: 280rpx;
  margin: 54rpx auto 0;
}

.c-btn{
  margin-right: 38rpx;
}
.c-icon{
  width:44rpx;
  height:45rpx;
}
.c-icon2{
  width:45rpx;
  height:45rpx;
}
.look-btn{
  background: $--ym-bg-primary;
  border-radius: 50rpx;
  color:#fff;
  font-size:32rpx;
}
.add-comment-btn{
  background: #fff;
  border: 1px solid $--ym-color-primary;
  border-radius: 50rpx;
  color: $--ym-color-primary;
  font-size:32rpx;
}
.bottom{
  width:696rpx;
}
</style>
