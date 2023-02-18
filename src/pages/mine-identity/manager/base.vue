<template>
  <view class="wrap my-base-card">
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48">基本信息</view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" @click="goCover">
        <view class="action-text text-color-primary">头像</view>
        <view class="flex-grow-1 flex jc-end u-m-r-30">
          <image :src="fullAvatar?fullAvatar:'../../../assets/mine/default.png'" class="head-icon"></image>
        </view>
        <image src="../../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">所属机构</view>
        <u-input maxlength="50" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.investInstitution" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">职位</view>
        <u-input maxlength="10" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.position" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">联系电话</view>
        <u-input maxlength="13" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.phone" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28">
        <view class="action-text text-color-primary">联系邮箱</view>
        <u-input maxlength="60" class="action-value text-color-third u-p-r-30" trim="true" input-align="right" v-model="params.email" border="false" placeholder="请输入"></u-input>
      </view>
      <view class="required action-item flex ai-center jc-between u-p-y-48 fs-28" @click="goRegion">
        <view class="action-text  text-color-primary">所属地区</view>
        <view class="flex ai-center">
          <view class="action-value u-p-r-30 flex jc-end" :class="params.belongCity? 'text-color-primary': 'text-color-third'">{{params.belongCity? params.belongProvinceStr +''+params.belongCityStr: '请选择'}}</view>
          <image src="../../../assets/mine/arrow.png" class="arrow"></image>
        </view>
      </view>

    </view>

    <view class="footer-wrap fs-32">
      <view class="footer-inner">
        <view class="next-btn" @click="submit">保存并继续</view>
      </view>
    </view>

  </view>
</template>

<script lang="ts" setup>
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
const config = useConfig();
let isSubmit = false;
const unionId = ref("");
const fullAvatar = ref("");

const params: any = reactive({
  id: "",
  avatar: "",
  position: "",
  belongProvince: "",
  belongCity: "",
  belongCityStr: "",
  belongProvinceStr: "",
  phone: "",
  email: "",
  investInstitution: "",
});

const goRegion = () => {
  uni.$once("features-page/region-city-selection:confirm", (data) => {
    params.belongProvince = data[0].provinceId;
    params.belongCity = data[0].cityId;
    params.belongProvinceStr = data[0].provinceName;
    params.belongCityStr = data[0].cityName;
  });
  uni.navigateTo({
    url:
      "/pages/features-page/region-city-selection?limit=1?value=" +
      params.belongCity,
  });
};

const goCover = () => {
  uni.$once("uAvatarCropper", async (path) => {
    let result = await service.app.uploadFile({
      filePath: path,
    });
    let file = JSON.parse(result.data);
    params.avatar = file.data.url ? file.data.url : "";
    fullAvatar.value = file.data.url
      ? config.ASSETS_BASE_URL + file.data.url
      : "";
  });
  uni.navigateTo({
    url: "/pages/cropper/cropper?destWidth=" + 320 + "&rectWidth=" + 320,
  });
};
const submit = async () => {
  if (
    params.avatar === "" ||
    params.avatar == undefined ||
    params.avatar == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请上传头像",
    });
    return;
  }
  if (
    params.position === "" ||
    params.position == undefined ||
    params.position == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入职位",
    });
    return;
  }
  if (
    params.phone === "" ||
    params.phone == undefined ||
    params.phone == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入联系电话",
    });
    return;
  } else {
    if (!(isPhone(params.phone) || isTelPhone(params.phone))) {
      uni.showToast({
        icon: "none",
        title: "请输入合法的固定电话或者手机号码",
      });
      return;
    }
  }
  if (
    params.email === "" ||
    params.email == undefined ||
    params.email == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请输入联系邮箱",
    });
    return;
  } else {
    if (!isEmail(params.email)) {
      uni.showToast({
        icon: "none",
        title: "请输入合法的邮箱",
      });
      return;
    }
  }
  if (
    params.belongCity === "" ||
    params.belongCity == undefined ||
    params.belongCity == null
  ) {
    uni.showToast({
      icon: "none",
      title: "请选择所属地区",
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

const getDetail = async () => {
  const result = await service.certification.getManagerDetail({
    id: unionId.value,
  });
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      if (key === "avatar") {
        fullAvatar.value = result[key]
          ? config.ASSETS_BASE_URL + result[key]
          : "";
      }
      params[key] = result[key];
    });
  }
  params.id = unionId.value;
};

onLoad(async (options) => {
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

.head-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  overflow: hidden;
  max-width: 70rpx;
  min-width: 70rpx;
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
