<template>
  <view class="safe my-base-card">
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48">投资偏好</view>
      <view class="required action-item u-p-y-48 fs-28">
        <view class="flex ai-center jc-between" @click="goRegion">
          <view class="action-text text-color-primary">关注地区</view>
          <view class="flex ai-center">
            <view class="action-value text-color-third u-p-r-30 flex jc-end">请选择</view>
            <image src="../../../assets/mine/arrow.png" class="arrow"></image>
          </view>
        </view>
        <view class="select-wrap flex flex-wrap">
          <view class="select-item" v-for="(item, idx) in params.focusAreasStr" :key="idx">{{ item.cityIdStr || item.cityName }}</view>
        </view>
      </view>
      <ym-cell-fileds :create="true" align="right" label="投资领域" v-model="params.investFieldsArray" />
      <ym-cell-rounds :create="true" align="right" label="投资轮次" v-model="params.investRoundsArray" />

      <picker mode="multiSelector" :range="range" :value="rangeValue" @columnchange="columnchange" @change="investchange">
        <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
          <view class="action-text text-color-primary">单笔投额</view>
          <view class="flex ai-center">
            <text v-if="params.investment" style="padding: 0 24rpx">{{
            params.investment
          }}</text>
            <text v-else style="color: #c0c4cc; padding: 0 24rpx">请选择</text>
            <image src="../../../assets/mine/arrow.png" class="arrow"></image>
          </view>
        </view>
      </picker>
    </view>

    <view class="footer-wrap fs-32">
      <view class="footer-inner">
        <view class="next-btn" @click="submit">保存并继续</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from "vue";
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
const service = useService();

const rangeValue: any = reactive([5, 5]);
const params: any = reactive({
  id: "",
  investment: "",
  focusAreasArray: [],
  investRoundsArray: [],
  investFieldsArray: [],
  investFields: [],
  investRounds: [],
  focusAreasStr: [],
});

let options: any = reactive([]);
let optionsRound: any = reactive([]);

const goRegion = () => {
  let arr: any = [];
  let arrStr = "";
  if (params.focusAreasArray && params.focusAreasArray.length > 0) {
    arr = params.focusAreasArray.map((item: any) => item.cityId);
    arrStr = arr.join(",");
  } else {
    arrStr = "";
  }
  uni.$once("features-page/region-city-selection:confirm", (data) => {
    params.focusAreasArray = data;
    params.focusAreasStr = data;
    // params.belongProvince = data[0].provinceId
    // params.belongCity = data[0].cityId
    // params.belongProvinceStr = data[0].provinceName
    // params.belongCityStr = data[0].cityName
  });
  uni.navigateTo({
    url: "/pages/features-page/region-city-selection?limit=10&value=" + arrStr,
  });
};

const getManagerDetail = async () => {
  const result = await service.certification.getManagerDetail({
    id: unionId.value,
  });
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      params[key] = result[key];
    });
  }
  params.id = unionId.value;
};

const submit = async () => {
  console.log(params);
  if (params.focusAreasArray === null || params.focusAreasArray.length === 0) {
    uni.showToast({
      icon: "none",
      title: "请选择关注地区",
    });
    return;
  }
  if (
    params.investFieldsArray === null ||
    params.investFieldsArray.length === 0
  ) {
    uni.showToast({
      icon: "none",
      title: "请选择投资领域",
    });
    return;
  }
  if (
    params.investRoundsArray === null ||
    params.investRoundsArray.length === 0
  ) {
    uni.showToast({
      icon: "none",
      title: "请选择投资轮次",
    });
    return;
  }
  if (
    params.investment === "" ||
    params.investment === null ||
    params.investment === undefined
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入单笔投额",
    });
    return;
  }
  if (isSubmit) {
    return false;
  }
  isSubmit = true;
  uni.showLoading({});
  try {
    const result = await service.certification.addManagerDraft(params);
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
onLoad(async (options) => {
  unionId.value = options.unionId || "";
  getManagerDetail();
});
const leftValue = [
  "0",
  "500万",
  "1000万",
  "2000万",
  "3000万",
  "5000万",
  "1亿",
  "2亿",
  "5亿",
  "10亿",
  "20亿",
  "30亿",
  "50亿",
  "100亿",
  "200亿",
];
const rightValue = [
  "500万",
  "1000万",
  "2000万",
  "3000万",
  "5000万",
  "1亿",
  "2亿",
  "5亿",
  "10亿",
  "20亿",
  "30亿",
  "50亿",
  "100亿",
  "200亿",
  "以上",
];
const range: any = reactive([leftValue, rightValue]);
const columnchange = (e: any) => {
  if (e.detail.column === 0) {
    rangeValue[0] = e.detail.value;
    if (e.detail.value > rangeValue[1]) {
      rangeValue[1] = e.detail.value;
    }
  } else {
    rangeValue[1] = e.detail.value;
    if (rangeValue[0] > e.detail.value) {
      rangeValue[0] = e.detail.value;
    }
  }
};
const investchange = () => {
  params.investment =
    leftValue[rangeValue[0]] + "~" + rightValue[rangeValue[1]];
};
// const getRangeIndex = (value: string) => range.indexOf(value) > 0 ? range.indexOf(value) : 0
// const getRange = (index: number) => range[index]
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

.select-item {
  width: 156rpx;
  box-sizing: border-box;
  padding: 0 22rpx;
  min-width: 156rpx;
  height: 76rpx;
  background: #f7f7f7;
  border-radius: 12rpx;
  font-size: 22rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  margin-top: 24rpx;
  text-align: center;

  &:nth-child(4n + 4) {
    margin-right: 0;
  }
}

.fileds-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
}

.footer-btn-wrap {
  position: absolute;
  z-index: 999;
  bottom: 0;
  left: 0;
}
</style>
