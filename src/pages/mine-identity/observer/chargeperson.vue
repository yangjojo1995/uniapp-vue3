<template>
  <view class="my-base-card">
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48">单位联系人</view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text  text-color-primary">姓名</view>
        <u-input maxlength="25" class="action-value text-color-third u-p-r-30 fs-28" trim="true" input-align="right" v-model="params.contactName" border="false" placeholder="请输入"></u-input>

      </view>
      <view class="action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">职务</view>
        <u-input maxlength="20" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.position" border="false" placeholder="请输入"></u-input>

      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">联系电话</view>
        <u-input maxlength="13" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.contactPhone" border="false" placeholder="请输入"></u-input>

      </view>
      <view class=" action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">通讯地址</view>
        <u-input maxlength="60" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.address" border="false" placeholder="请输入"></u-input>

      </view>
      <view class=" action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">邮箱</view>
        <u-input maxlength="50" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.contactEmail" border="false" placeholder="请输入"></u-input>

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

let isSubmit = false;
const unionId = ref("");
const params: any = reactive({
  id: "",
  contactName: "",
  position: "",
  contactPhone: "",
  address: "",
  contactEmail: "",
});
const service = useService();

const submit = async () => {
  if (
    params.contactName === "" ||
    params.contactName == undefined ||
    params.contactName == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入单位联系人姓名",
    });
    return;
  }

  if (
    params.contactPhone === "" ||
    params.contactPhone == undefined ||
    params.contactPhone == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入单位联系人联系电话",
    });
    return;
  } else {
    if (!(isPhone(params.contactPhone) || isTelPhone(params.contactPhone))) {
      uni.showToast({
        icon: "none",
        title: "请输入合法的固定电话或者手机号码",
      });
      return;
    }
  }
  if (params.contactEmail) {
    if (!isEmail(params.contactEmail)) {
      uni.showToast({
        icon: "none",
        title: "请输入合法的邮箱",
      });
      return;
    }
  }

  if (isSubmit) {
    return false;
  }
  isSubmit = true;
  uni.showLoading({});
  try {
    const result = await service.certification.addObserverDraft(params);
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

const getObserverDetail = async () => {
  const result = await service.certification.getObserverDetail({
    id: unionId.value,
  });
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      params[key] = result[key];
    });
  }
  params.id = unionId.value;
  console.log(params);
};
onLoad((options) => {
  unionId.value = options.unionId || "";
  getObserverDetail();
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
    word-break: break-all;
  }
  .action-value {
    word-break: break-all;
    font-family: PingFangSC-Regular, PingFang SC;
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
</style>
