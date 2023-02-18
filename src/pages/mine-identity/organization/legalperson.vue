<template>
  <view class="my-base-card">
    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48">法定代表人</view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text  text-color-primary">姓名</view>
        <u-input maxlength="25" class="action-value text-color-third u-p-r-30 fs-28" trim="true" input-align="right" v-model="params.legalRepresentativeName" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">职务</view>
        <u-input maxlength="20" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.legalRepresentativePosition" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">联系电话</view>
        <u-input maxlength="13" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.legalRepresentativePhone" border="false" placeholder="请输入"></u-input>
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

const service = useService();
const unionId = ref("");
let isSubmit = false;
const params: any = reactive({
  id: "",
  legalRepresentativeName: "",
  legalRepresentativePosition: "",
  legalRepresentativePhone: "",
});
const submit = async () => {
  if (
    params.legalRepresentativeName === "" ||
    params.legalRepresentativeName == undefined ||
    params.legalRepresentativeName == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入法人姓名",
    });
    return;
  }
  if (
    params.legalRepresentativePosition === "" ||
    params.legalRepresentativePosition == undefined ||
    params.legalRepresentativePosition == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入法人职务",
    });
    return;
  }
  if (
    params.legalRepresentativePhone === "" ||
    params.legalRepresentativePhone == undefined ||
    params.legalRepresentativePhone == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入法人联系方式",
    });
    return;
  } else {
    if (
      !(
        isPhone(params.legalRepresentativePhone) ||
        isTelPhone(params.legalRepresentativePhone)
      )
    ) {
      uni.showToast({
        icon: "none",
        title: "请输入合法的固定电话或者手机号码",
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
    const result = await service.certification.addOrganizationDraft(params);
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

const getOrganizationDetail = async () => {
  const result = await service.certification.getOrganizationDetail({
    id: unionId.value,
  });
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      params[key] = result[key];
    });
  }
  params.id = unionId.value;
};
onLoad(async (options) => {
  unionId.value = options.unionId || "";
  getOrganizationDetail();
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
