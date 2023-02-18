<template>
  <view class="wrap safe my-base-card">
    <view class="action-list u-p-x-26 bg-white">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48">基本信息</view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" @tap="goCover">
        <view class="action-text text-color-primary">LOGO</view>
        <view class="flex-grow-1 flex jc-end u-m-r-30">
          <image :src="fullLogo?fullLogo:'../../../assets/mine/default.png'" class="head-icon"></image>
        </view>
        <image src="../../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">机构简称</view>
        <u-input maxlength="10" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.shortName" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">单位性质</view>
        <view class="flex ai-center">
          <picker mode="selector" @change="getNature($event)" :range="natureList">
            <view class="action-value u-p-r-30 flex jc-end" :class="params.nature? 'text-color-primary': 'text-color-third'">{{params.nature?params.nature:'请选择'}}</view>
          </picker>
          <image src="../../../assets/mine/arrow.png" class="arrow"></image>
        </view>

      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" v-if="params.nature === '其他'">
        <view class="action-text text-color-primary">具体单位性质</view>
        <u-input maxlength="10" class="action-value text-color-primary u-p-r-30" trim="true" input-align="right" v-model="params.detailNature" border="false" placeholder="请输入"></u-input>
        <image src="../../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">注册资本金(万元)</view>
        <input type="digit" maxlength="10" class="action-value text-color-third u-p-r-30 input" trim="true" input-align="right" v-model="params.registeredCapital" border="false" placeholder="请输入" />
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">成立时间</view>
        <view class="flex ai-center ">
          <picker mode="date" @change="getFoundTime($event)">
            <view class="action-value  u-p-r-30 flex jc-end" :class="params.foundTime? 'text-color-primary': 'text-color-third'">{{params.foundTime? time.formatTimeDate(params.foundTime):'请选择'}}</view>
          </picker>
          <image src="../../../assets/mine/arrow.png" class="arrow"></image>
        </view>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">从业人员数量(人)</view>
        <input type="number" maxlength="10" class="action-value text-color-third u-p-r-30 input" trim="true" input-align="right" v-model="params.practitionerNum" border="false" placeholder="请输入" />
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text  text-color-primary">业务规模</view>
        <u-input maxlength="50" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.businessScale" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text  text-color-primary">单位地址</view>
        <u-input maxlength="60" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.address" border="false" placeholder="请输入"></u-input>
      </view>
    </view>
    <view class="footer-wrap fs-32">
      <view class="footer-inner">
        <view class="next-btn" @click="submit">保存并继续</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import {
  router,
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo,
} from "@/plugins/app-core";
import { isInit, isNumber, isPhone, isTelPhone, isEmail } from "@/utils/regex";
import time from "@/utils/time";

const show = ref(true);
const natureList = reactive([
  "私募股权投资基金管理公司",
  "证券公司",
  "产业投资机构",
  "其他",
]);

let isSubmit = false;
const params: any = reactive({
  id: "",
  shortName: "", //简称
  logo: "", // logo
  nature: "", //性质
  detailNature: "", // 具体单位性质，性质为其他时此项必填
  registeredCapital: "", //资本本金注册
  foundTime: "", // 创立时间
  practitionerNum: "", //从业人数
  businessScale: "", //业务规模
  address: "", // //单位地址
});
const unionId = ref(""); // id
const fullLogo = ref("");
const service = useService();
const config = useConfig();

const getNature = (e: any) => {
  params.nature = natureList[e.detail.value];
  console.log(natureList);
};
const getFoundTime = (e: any) => {
  params.foundTime = e.detail.value;
};
const goRule = () => {
  uni.navigateTo({
    url: "/pages/mine/rule",
  });
};
const goIntroduce = () => {
  uni.navigateTo({
    url: "/pages/mine-identity/observer/introduce",
  });
};

const goCover = () => {
  uni.$once("uAvatarCropper", async (path) => {
    let result = await service.app.uploadFile({
      filePath: path,
    });
    let file = JSON.parse(result.data);
    params.logo = file.data.url;
    fullLogo.value = config.ASSETS_BASE_URL + file.data.url;
  });
  uni.navigateTo({
    url: "/pages/cropper/cropper?destWidth=" + 320 + "&rectWidth=" + 320,
  });
};
const deleteFile = (index: number) => {
  fullLogo.value = "";
  params.logo = "";
};
const submit = async () => {
  if (params.logo === "" || params.logo == undefined || params.logo == null) {
    uni.showToast({
      icon: "none",
      title: "请上传公司logo图片",
    });
    return;
  }
  if (
    params.shortName === "" ||
    params.shortName == undefined ||
    params.shortName == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入公司简称",
    });
    return;
  }
  if (
    params.nature === "" ||
    params.nature == undefined ||
    params.nature == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请选择公司性质",
    });
    return;
  } else {
    if (params.nature === "其他") {
      if (
        params.detailNature === "" ||
        params.detailNature === null ||
        params.detailNature === undefined
      ) {
        uni.showToast({
          icon: "none",
          title: "请输入具体单位性质",
        });
        return;
      }
    }
  }
  if (
    params.registeredCapital === "" ||
    params.registeredCapital == undefined ||
    params.registeredCapital == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入注册资本金",
    });
    return;
  } else {
    if (!isNumber(params.registeredCapital)) {
      uni.showToast({
        icon: "none",
        title: "注册资本金只支持输入数字且最多两位小数",
      });
      return;
    }
  }
  if (
    params.foundTime === "" ||
    params.foundTime == undefined ||
    params.foundTime == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请选择创立时间",
    });
    return;
  }
  if (
    params.practitionerNum === "" ||
    params.practitionerNum == undefined ||
    params.practitionerNum == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入从业人数",
    });
    return;
  } else {
    if (!isInit(params.practitionerNum)) {
      uni.showToast({
        icon: "none",
        title: "从业人数只能输入整数",
      });
      return;
    }
  }
  if (
    params.businessScale === "" ||
    params.businessScale == undefined ||
    params.businessScale == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入业务规模",
    });
    return;
  }

  if (
    params.address === "" ||
    params.address == undefined ||
    params.address == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入单位地址",
    });
    return;
  }
  if (isSubmit) {
    return false;
  }
  isSubmit = true;
  uni.showLoading({});
  let paramsCopy = JSON.parse(JSON.stringify(params));
  paramsCopy.foundTime = new Date(paramsCopy.foundTime).getTime();
  try {
    const result = await service.certification.addOrganizationDraft(paramsCopy);
    setTimeout(() => {
      uni.hideLoading();
      isSubmit = false;
      uni.navigateBack({
        delta: 1,
      });
    }, 500);
  } catch (error) {
    isSubmit = false;
  }
};

const getDetail = async () => {
  const result = await service.certification.getOrganizationDetail({
    id: unionId.value,
  });
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      if (key === "logo") {
        fullLogo.value = result[key]
          ? config.ASSETS_BASE_URL + result[key]
          : "";
      }
      params[key] = result[key];
    });
  }
  params.id = unionId.value;
};

onLoad(async (options) => {
  // Object.keys(obj).forEach(item => {
  //   console.log(item)
  // })
  unionId.value = options.unionId || "";
  params.id = options.unionId || "";
  await getDetail();
});
</script>

<style lang="scss" scoped>
.action-list {
  border-radius: 12rpx;
  .action-text {
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 110rpx;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .action-value {
    word-break: break-all;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .input {
    font-size: 28rpx;
    text-align: right;
    color: #333;
  }
  .action-title {
    border-bottom: 1rpx solid #ece7e3;
    position: relative;
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

.min-height {
  height: unset !important;
  .introduce {
    padding-top: 20rpx;
  }
}
.head-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  overflow: hidden;
  max-width: 70rpx;
  min-width: 70rpx;
}
</style>
