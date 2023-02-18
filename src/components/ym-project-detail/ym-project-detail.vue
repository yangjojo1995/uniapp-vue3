<template>
  <view>
    <view class="wrap  u-p-b-60">
      <!-- 项目基本信息 -->
      <view class="u-m-t-40 u-m-b-20">
        <view class="info-wrap">
          <image :src="config.ADMIN_ASSETS_URL + 'info-bg.png'" class="bg w-100"></image>
          <view>
              <view class="s-flex u-m-t-50 u-m-l-24 u-m-r-24">
              <view>
                <view class="complete">资料完整度：<text>{{projectBase.completeDegree ? projectBase.completeDegree+'%' : '-' }}</text></view>
                <view class="fs-32 text-color-primary flex-1 bold title u-m-t-16">
                  {{ projectBase.projectName }}
                </view>
                <view class="flex fs-26 text-color-primary u-p-t-20">
                  <text class="fbr-text">发布人：</text>
                  <view class="flex" v-if="projectBase.publisherInfo?.name" @click="toCompanyDetail">
                    <image v-if="projectBase.avatar" class="company" :src="assets(projectBase.avatar)" mode="aspectFit" />
                    <image v-else class="company" src="../../assets/project/default.png" mode="aspectFit" />
                    <text class="name-text text-nowrap">{{ projectBase.publisherInfo?.name }}</text>
                    <image
                      class="go-icon"
                      src="../../assets/project/go_icon.png"
                      mode="aspectFit"
                    />
                  </view>
                  <text v-else class="">暂无 </text>
                </view>
              </view>
              <view>
                <image
                  class="project-img"
                  v-if="projectBase.image"
                  @click="previewImg(projectBase.image, [projectBase.image])"
                  :src="assets(projectBase.image)"
                />
                <image class="project-img" v-else :src="projectDefaultImg" mode="aspectFill" />
              </view>
            </view>
            <view class="fs-24 u-p-t-16 u-p-b-30 u-p-l-24 u-p-r-24">
              <text class="text-color-secondary introduce-desc">{{
                projectBase.description
              }}</text>
            </view>
          </view>

        </view>

        <view class="block-3 flex ai-center fs-24">
          <view class="block-1">
            <view>{{ projectBase.industryDict?.itemName }}</view>
            <view>所属行业</view>
          </view>
          <view class="vertical-line"></view>
          <view class="block-1">
            <view v-if="!identity">{{ projectBase.assessedValue || '-' }}</view>
            <view class="occlusion" v-else></view>
            <view>项目估值</view>
          </view>
          <view class="vertical-line"></view>
          <view class="block-1">
            <view v-if="!identity">{{
              projectBase.investRoundDict?.itemName || '-'
            }}</view>
            <view class="occlusion" v-else></view>
            <view>轮次</view>
          </view>
        </view>
      </view>
      <!-- 推荐单位 -->
      <view v-if="projectBase.orgId" class="u-m-b-20">
        <view class="info-wrap">
          <image src="../../assets/project/tuijian_bg.png" class="bg tuijian_bg w-100"></image>
          <image src="../../assets/project/tujian_icon.png" class="tuijian_icon"></image>
          <view class="">
            <view class="fs-34 u-m-l-24 u-m-t-25 u-m-b-25">
              {{projectBase.orgName}}
            </view>
            <view v-if="projectBase.comment" class="fs-26 text-color-third u-p-l-24 u-p-r-24 u-p-t-10 u-p-b-20 bg-white">
              {{projectBase.comment}}
            </view>
          </view>

        </view>
      </view>

      <!-- 项目信息&财务状况 tab -->
      <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#12C287"></uni-segmented-control>

      <!-- 项目信息tab -->
      <view v-if="current === 0" class="tab-content tab-project">
        <view class="flex ai-center" >
          <!-- <image src="../../assets/project/project.png" class="tab-content-icon"></image> -->
          <view class="fs-32 text-color-primary flex-1 bold">
            项目信息
          </view>
        </view>
        <!-- 企业信息 -->
        <ym-project-collsage2
            title="企业信息"
            v-if="projectCompany.companyName ||
             projectCompany.belongProvinceStr ||
             projectCompany.registeredCapita ||
             projectCompany.practitionerNum ||
             projectCompany.legalRepresentativeName"
          >
            <view v-if="projectCompany.companyName" class="flex jc-between u-m-t-20">
              <text class="text-color-third fs-24 u-m-r-20 label ym-text-nowrap">企业全称</text>
              <text class="text-color-secondary fs-24">{{ projectCompany.companyName}}</text>
            </view>
            <view v-if="projectCompany.belongProvinceStr" class="flex jc-between u-m-t-20">
              <text class="text-color-third fs-24 u-m-r-20 label ym-text-nowrap">地区</text>
              <text class="text-color-secondary fs-24">{{projectCompany.belongProvinceStr}}{{projectCompany.belongCityStr}}{{projectCompany.belongDistrictStr}}</text>
            </view>
            <view v-if="projectCompany.registeredCapital" class="flex jc-between u-m-t-20">
              <text class="text-color-third fs-24 u-m-r-20 label ym-text-nowrap">注册资本</text>
              <text class="text-color-secondary fs-24">{{ projectCompany.registeredCapital}}万</text>
            </view>
            <view v-if="projectCompany.practitionerNum" class="flex jc-between u-m-t-20">
              <text class="text-color-third fs-24 u-m-r-20 label ym-text-nowrap">员工人数</text>
              <text class="text-color-secondary fs-24">{{projectCompany.practitionerNum}}人</text>
            </view>
            <view v-if="projectCompany.legalRepresentativeName" class="flex jc-between u-m-t-20">
              <text class="text-color-third fs-24 u-m-r-20 label ym-text-nowrap">法定代表</text>
              <text class="text-color-secondary fs-24">{{projectCompany.legalRepresentativeName}}</text>
            </view>
        </ym-project-collsage2>
        <!-- 主营业务 -->
        <ym-project-collsage2
            title="主营业务"
            v-if="projectCompany.mainBusiness"
          >
          {{projectCompany.mainBusiness || '-'}}
        </ym-project-collsage2>
        <!-- 联系人 -->
        <ym-project-collsage2
            title="联系人"
          >
          <view class="flex jc-between u-m-b-20">
            <text class="text-color-secondary fs-24 u-m-r-20 label ym-text-nowrap">项目联系人</text>
            <text class="text-color-secondary fs-24">{{projectBase.director}}</text>
          </view>
          <view class="flex jc-between">
            <text class="text-color-secondary fs-24 u-m-r-20 label ym-text-nowrap">联系人电话</text>
            <text class="text-color-secondary fs-24">{{projectBase.mobile || '-'}}</text>
          </view>
        </ym-project-collsage2>
        <!-- 基本信息 -->
        <ym-project-collsage2
            title="基本信息"
            v-if="projectBase.financingPlan ||
            projectBase.financingPurpose ||
            projectBase.investment ||
            projectBase.equityExitWay ||
            projectBase.marketShare ||
            projectBase.industryStatus ||
            projectBase.industryLevelOneDict
            "
          >
          <view v-if="projectBase.financingPlan" class="fz-26 u-m-t-20 bold">股权融资需求</view>
          <view v-if="projectBase.financingPlan" class="fw-400 u-m-b-20">{{projectBase.financingPlan ? projectBase.financingPlan + '万元' : '-'}}</view>
          <view v-if="projectBase.financingPurpose" class="fz-26 u-m-t-20 bold">融资用途</view>
          <view v-if="projectBase.financingPurpose" class="fw-400 u-m-b-20">{{projectBase.financingPurpose || '-'}}</view>
          <view v-if="projectBase.investment" class="fz-26 u-m-t-20 bold">历往获投金额</view>
          <view v-if="projectBase.investment" class="fw-400 u-m-b-20">{{projectBase.investment ? projectBase.investment + '万元' : '-'}}</view>
          <view v-if="projectBase.equityExitWay" class="fz-26 u-m-t-20 bold">股权投资退出方式</view>
          <view v-if="projectBase.equityExitWay" class="fw-400 u-m-b-20">{{projectBase.equityExitWay || '-'}}</view>
          <view v-if="projectBase.marketShare" class="fz-26 u-m-t-20 bold">市场份额</view>
          <view v-if="projectBase.marketShare" class="fw-400 u-m-b-20">{{projectBase.marketShare || '-'}}</view>
          <view v-if="projectBase.industryStatus" class="fz-26 u-m-t-20 bold">行业地位</view>
          <view v-if="projectBase.industryStatus" class="fw-400 u-m-b-20">{{projectBase.industryStatus || '-'}}</view>
          <view v-if="projectBase.industryLevelOneDict" class="fz-26 u-m-t-20 bold">行业细分</view>
          <view v-if="projectBase.industryLevelOneDict" class="fw-400 u-m-b-20">{{projectBase.industryLevelOneDict && projectBase.industryLevelOneDict.itemName}}{{projectBase.industryLevelTwoDict ? ' / '+ projectBase.industryLevelTwoDict.itemName:''}}{{projectBase.industryLevelOneDict?'':'-'}}</view>
        </ym-project-collsage2>
        <!-- 项目亮点 -->
        <ym-project-collsage2
          v-if="projectBase.advantage"
          title="项目亮点"
          :content="projectBase.advantage"
          ></ym-project-collsage2>
        <!-- 市场分析 -->
        <ym-project-collsage2
            v-if="projectBase.marketAnalysis"
            title="市场分析"
            :content="projectBase.marketAnalysis"
          ></ym-project-collsage2>
        <!-- 商业模式 -->
        <ym-project-collsage2
          v-if="projectBase.businessModel"
          title="商业模式"
          :content="projectBase.businessModel"
          ></ym-project-collsage2>
        <!-- 产品和服务 -->
        <ym-project-collsage2
          v-if="(projectProduct.image&&projectProduct.image.length>0) || projectProduct.productName || projectProduct.description"
            title="产品和服务"
          >
          <view>
            <view class="text-color-primary fs-28 bold u-p-b-20 u-p-t-10">{{projectProduct.productName}}</view>
            <view class="introduce-desc text-color-secondary">{{projectProduct.description}}</view>
            <view class="u-m-t-20">
              <image
                class="product"
                v-for="(item,index) in projectProduct.image"
                :key="index"
                :src="
                item
                    ? assets(item)
                    : item
                "
                mode="aspectFit"
                @click="previewImg(item, projectProduct.image)"
              />
            </view>

          <!-- <image @click="previewImg(p, item.pictures )" class="detail-info-image" mode="widthFix" v-for="(p,i) in item.pictures" :key="i" :src="assets(p)"></image> -->

        </view>
        </ym-project-collsage2>
        <!-- 运营情况 -->
        <ym-project-collsage2
          v-if="projectBase.operation"
          title="运营情况"
          :content="projectBase.operation"
        ></ym-project-collsage2>
        <!-- 团队成员 -->
        <ym-project-collsage2 title="团队成员" v-if="projectMembers && projectMembers.length>0">
          <view>
            <ym-project-group
              :showBorder="index > projectMembers.length - 1"
              :item="item"
              v-for="(item, index) in projectMembers"
              :key="item.id"
            >
            </ym-project-group>
          </view>
        </ym-project-collsage2>
        <!-- 确权信息 -->
        <ym-project-collsage2 title="确权信息" v-if="authenticInfo && authenticInfo.length>0">
          <view class="progress-wrap">
            <view
              class="progress-item"
              v-for="(item, index) in authenticInfo"
              :key="item.id"
            >
              <view class="flex ai-center">
                <image
                  src="../../assets/mine/chain.png"
                  class="u-m-r-20 chain"
                ></image>
                <text class="text-color-primary bold">{{ item.process }}</text>
              </view>
              <view class="progress-info">
                <view class="flex jc-between info-item">
                  <text class="text-color-third fs-24 label">确权人</text>
                  <text class="text-color-secondary fs-24">{{
                    item.representativeIdStr
                  }}</text>
                </view>
                <view class="flex jc-between info-item">
                  <text class="text-color-third fs-24 label">确权时间</text>
                  <text class="text-color-secondary fs-24">{{
                    time.formatTime(item.createTime)
                  }}</text>
                </view>
              </view>
            </view>
          </view>
        </ym-project-collsage2>
      </view>

      <!-- 财务状况tab -->
      <view v-if="current === 1" class="tab-content tab-project">
        <view class="flex ai-center" >
          <!-- <image src="../../assets/project/finance.png" class="tab-content-icon"></image> -->
          <view class="fs-32 text-color-primary flex-1 bold">财务状况</view>
        </view>
        <ym-empty v-if="!financeList || !financeList.length" text="暂无数据"></ym-empty>
        <view v-else>
          <view class="flex jc-between u-m-t-40">
            <text class="text-color-primary bold fs-26 u-m-r-20 label ym-text-nowrap">近3年财务状况</text>
            <text class="text-color-secondary fs-24">单位：万元</text>
          </view>
          <!-- 表格 -->
          <view class="table">
            <view>
              <view class="table-tr text-color-secondary"
                    :class="{'text-color-primary bold' : (index===0)}"
                    v-for="(item,index) in financeList" :key="index">
                  <view class="table-td td1 text-color-primary bold fs-24">{{item[0]}}</view>
                  <view class="table-td fs-24 fw-400">{{item[1]}}</view>
                  <view class="table-td fs-24 fw-400">{{item[2]}}</view>
                  <view class="table-td fs-24 fw-400">{{item[3]}}</view>
              </view>
            </view>
            <!-- 无财务查看权限 -->
            <view v-if="!myProject && (applyStatus=='1' || applyStatus=='2')" class="hide-blur">
              <view class="hide-blur__bg"></view>
              <view class="hide-blur__content">
                <image src="../../assets/project/unlock.png" class="unlock"></image>
                <view class="u-p-t-68 u-p-b-30">该项目的财务状况需向项目发布人授权查看</view>
                <ym-button @click="emit('finance-apply', projectBase, $event)">立即申请查看权限</ym-button>
              </view>
            </view>
          </view>

        </view>

      </view>

      <!-- 点评tab -->
      <view v-if="current === 2" class="tab-content tab-project">
        <!-- <view class="flex ai-center" >
          <image src="../../assets/project/comment.png" class="tab-content-icon"></image>
          <view class="fs-32 text-color-primary flex-1 bold">点评</view>
        </view> -->
        <ac-project-list :bindId="projectBase.id"></ac-project-list>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import assets from '@/utils/assets'
import projectDefaultImg from '@/assets/mine/project-default.png'
import { useRouter, useConfig } from '@/plugins/app-core'
import { previewImg } from '@/utils/preview'
import time from '@/utils/time'

const router = useRouter()
const config = useConfig()

const props = defineProps<{
    projectBase: any
    projectMembers: any
    projectProduct: any
    authenticInfo: any
    projectCompany: any
    financeList: any
    commentInfo: any
    identity?:boolean
    applyStatus?:string
    myProject?:{type:boolean, default:false}
  }>()

const emit = defineEmits<{
  (e: 'finance-apply', item: Object, event: any): void
  // (e: 'goComment', id: string): void
}>()

function goComment(id: string){
  uni.navigateTo({ url: '../../plugins/app-comment/packages/detail/detail?id=' + id })
  // emit('goComment', id)
}

const current = ref(0)

const toCompanyDetail = function (): void {
  const id = props.projectBase.publisher
  if (typeof id !== 'string') return

  if (props.projectBase.userType === 'institution') {
    router.push({ path: '/pages/organization/detail', query: { id } })
  } else if (props.projectBase.userType === 'enterprise') {
    router.push({ path: '/pages/company/detail', query: { id } })
  } else if (props.projectBase.userType === 'observer') {
    router.push({ path: '/pages/observer/detail', query: { id } })
  } else if (props.projectBase.userType === 'manager') {
    router.push({ path: '/pages/manager/detail', query: { id } })
  }
}

const items =computed(()=>{
  console.log(props.commentInfo)
  if(props.commentInfo.status){
    let text = '点评'
    if(props.commentInfo.commentNum > 0){
      text += '(' + props.commentInfo.commentNum + ')'
    }
    
    return ['项目信息', '财务状况', text]
  }
  if(!props.commentInfo.status){
    return ['项目信息', '财务状况']
  }
})
 
const onClickItem = function (e: any) {
  console.log(e)
  if (current.value !== e.currentIndex) {
    current.value = e.currentIndex
  }
}
</script>

<style lang="scss" scoped>
.complete{
  position: absolute;
  top: 0;left:auto;right:0;
  height: 40rpx;
  line-height: 40rpx;
  padding: 0 14rpx;
  background: #F9ECCB;
  border-radius: 12rpx 12rpx 12rpx 0;
  font-weight: 400;
  color: #666666;
  font-size: 20rpx;
  text{
  color: #333333;margin-left: 5rpx;
  }
}
.name-text{ max-width: 287rpx;}
.fbr-text{
  min-width: 114rpx;
}
.ai-end{
  align-items: end;
}
  .info-wrap{
    position: relative;
    overflow: hidden;
  }
  .bg{
    height: 640rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .info-content{
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    z-index: 1;
}
  .project-tag {
    padding: 8rpx 10rpx 8rpx 16rpx;
    border-bottom-left-radius: 22rpx;
    color: #fff;
    font-size: 24rpx;
    background-color: #018ff0;
    min-width: 104rpx;
    text-align: center;
    box-sizing: border-box;
  }

  .caogao {
    background-color: #6b54d4;
  }

  .stop {
    background-color: #7e8fc9;
  }

  .bold {
    font-weight: bold;
  }

  .title {
    white-space: break-spaces;
    word-break: break-all;
    overflow: hidden;
  }
  .u-m-b-12 {
    margin-bottom: 12rpx;
  }
  .u-p-b-25 {
    padding-bottom: 25rpx;
  }
  .banner {
    width: 100%;
    height: 421.875rpx;
  }
  .s-flex {
    display: flex;
    justify-content: space-between;
  }
  .project-img {
    width: 126rpx;
    height: 126rpx;
    border-radius: 50%;
  }
  .wrap {
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    overflow: hidden;
    position: relative;
    top: -20rpx;
    & > view {
      border-radius: 12rpx;
      margin-left: 24rpx;
      margin-right: 24rpx;
    }
    & > .teams{
      padding-bottom: 0;
    }
    .block-3 {
      justify-content: space-around;
      padding:30rpx 24rpx;
      background-color: #fff;
      .block-1 {
        text-align: center;
        line-height: 1;
        flex: 1;
        font-size: 24rpx;
        view:nth-child(1) {
          font-weight: bold;
          margin-bottom: 14rpx;
        }
        view:nth-child(2) {
          color: #666666;
        }
      }
      .vertical-line {
        height: 25rpx;
        width: 2rpx;
        background: #e2e2e2;
      }
    }
    .occlusion {
      width: 96rpx;
      height: 32rpx;
      background: #F7F7F7;
      margin: auto;
      margin-bottom: 14rpx;
    }
  }

  .company {
    width: 42rpx;
    min-width: 42rpx;
    height: 42rpx;
    background: #f2f2f2;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20rpx;
  }
  .go-icon{
    width: 47rpx;
    height: 47rpx;
    margin-top: -5rpx;
  }

  .project-label {
    min-width: 100rpx;
  }

  .product {
    width: 180rpx;
    height: 132rpx;
    border-radius: 8rpx;
  }

  .introduce-desc {
    font-size: 24rpx;
    line-height: 40rpx;
    word-break: break-all;
    white-space: pre-wrap;
    text-align: justify;
  }

  .chain {
    width: 32rpx;
    height: 32rpx;
  }
  .progress-item {
    font-size: 24rpx;
  }
  .progress-info {
    padding: 16rpx 0 16rpx 52rpx;
    margin: 12rpx 0;
    position: relative;
    &:before {
      content: '';
      width: 1rpx;
      height: 100%;
      background-color: #b0f2d2;
      position: absolute;
      left: 16rpx;
      top: 0;
    }
  }
  .info-item {
    margin-bottom: 20rpx;
  }
  .tuijian_bg{
    height: 159rpx;
  }
  .tuijian_icon{
    position: absolute;
    width: 151rpx;
    height: 38rpx;
    top: 0;
    left:auto;
    right:0;
  }
  .tab-content-icon{
    width: 33rpx;
    height: 33rpx;
    margin-right:18rpx;
  }
  .tab-content{
    margin-top: 32rpx;
    padding: 24rpx;
    background-color: #fff;
    border-radius: 12rpx;
  }
  .collapse-title{
    background: #E5F6EA;
  }
  .table{
    margin-top: 20rpx;
    border:2px solid #E9E9E9;
    border-radius: 8rpx;
    word-break: break-all;
    font-weight: 400;
    font-size: 0;
    position: relative;
  }
  .table-tr{
    padding:0 5rpx;
    border-bottom: 2px solid #E9E9E9;;
    &:last-child{
      border: 0;
    }
    &:first-child{
      background-color: #E9E9E9;
      color:#333;
      font-weight: bold;
      .fw-400{
        font-weight: bold;
      }
    }
  }
  .table-td{
    padding: 22rpx 8rpx;
    width: 157rpx;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    &.td1{
      width: 160rpx;
    }

  }
  .fw-400{
    font-weight: 400;
  }
  // 财务状况遮罩层
  .hide-blur{
    position: absolute;
    top: 82rpx;
    left: 164rpx;
    z-index: 1;
    width: 482rpx;
    height: 540rpx;

    &__bg{
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(4rpx);
      background-color: rgba(0, 0, 0, 0.3);
    }
    &__content {
      background-color: #fff;
      position: absolute;
      left: 30rpx;
      top: 110rpx;
      z-index: 3;
      width: 429rpx;
      height: 324rpx;
      box-sizing: border-box;
      padding: 42rpx;
      font-size: 26rpx;
      color: #333333;
      text-align: center;
      border-radius: 12rpx;
      .unlock{
        width: 199rpx;
        height: 208rpx;
        position: absolute;
        top: -80rpx;
    left: 133rpx;
      }
    }
  }

</style>
