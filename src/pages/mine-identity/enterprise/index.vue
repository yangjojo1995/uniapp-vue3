<template>
  <view class="my-base-card">
    <view class="action-list u-p-x-26 bg-white u-m-b-20 u-m-t-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goIdentity">资质认证
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content">
        <view class="flex jc-between">
          <text class="text-color-third fs-28 label">单位名称</text>
          <text class="text-color-secondary fs-28 word-break">{{params.fullName}}</text>
        </view>
      </view>
    </view>
    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goBase">基本信息
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-t-50 u-p-b-10 action-content" v-if="params.shortName">
        <view class="flex jc-between u-m-b-32 ai-center">
          <text class="text-color-third fs-28 label">机构简称</text>
          <view class="flex-1 flex jc-end">
            <image :src="fullLogo" class="logo"></image>
          </view>
          <text class="text-color-secondary fs-28">
            {{params.shortName}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">所属地区</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.belongProvinceStr}}{{params.belongCityStr}}</text>
        </view>
        <view class="flex jc-between u-m-b-32" v-if="params.belongIndustry">
          <text class="text-color-third fs-28 label">所属行业</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.belongIndustryStr}}</text>
        </view>
      </view>
    </view>

    <!--  联系人-->
    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goCharge">单位联系人
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-t-50 u-p-b-10 action-content" v-if="params.contactName">
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">姓名</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactName}}</text>
        </view>
        <view class="flex jc-between u-m-b-32" v-if="params.position">
          <text class="text-color-third fs-28 label">职务</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.position}}</text>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">联系电话</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactPhone}}</text>
        </view>
        <view class="flex jc-between u-m-b-32" v-if="params.address">
          <text class="text-color-third fs-28 label">通讯地址</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.address}}</text>
        </view>
        <view class="flex jc-between  u-m-b-32" v-if="params.contactEmail">
          <text class="text-color-third fs-28 label">电子邮箱</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{params.contactEmail}}</text>
        </view>
      </view>

    </view>

    <!-- 单位简介 -->
    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goIntroduce">单位简介
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="action-content u-p-b-36" v-if="params.summary">
        <ym-project-collsage :showExpand="true" :nopadding="true" :content="params.summary"></ym-project-collsage>
      </view>
    </view>

    <!-- 推荐单位 -->
<!--     <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goRecommended">推荐单位
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="action-content u-p-b-36" v-if="params.orgId">
        <ym-project-collsage :showExpand="true" :nopadding="true" :content="params.orgName"></ym-project-collsage>
      </view>
    </view> -->

    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary  u-p-y-48" @click="goRule">
        <text class="bold u-m-r-10">自我承诺签名</text>
        <text class="text-color-third fs-24 introduce flex-1 flex">
          (请阅读乡产投盟公约并承诺签名)
        </text>
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="picture flex ai-center u-p-y-50 action-content" v-if="fullSignature">
        <view class="pic" :key="index">
          <image :src="fullSignature" @tap="previewImage(fullSignature)" class="img" mode="widthFix"></image>
        </view>
      </view>
    </view>
    <view class="fs-24 text-color-secondary obey">
      <view class="flex ai-center u-p-32 agree" @tap="agreeFlag = !agreeFlag">
        <view class="checked u-m-r-4" :class="agreeFlag == false? '':'selected'"></view>
        <view class="u-m-l-8">同意将以上资料同步于投盟链</view>
      </view>
    </view>
    <view class="footer-wrap fs-32">
      <view class="footer-inner">
        <view class="next-btn" @click="goSubmit">提交</view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  onPullDownRefresh,
  onReachBottom,
  onLoad,
  onShow,
} from "@dcloudio/uni-app";
import {
  router,
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo,
} from "@/plugins/app-core";
const agreeFlag = ref(false);
const fullLogo = ref("");
const unionId = ref("");
const fullSignature = ref("");
const service = useService();
const config = useConfig();
const params = reactive({});
let isSubmit = false;

const goIdentity = () => {
  uni.navigateTo({
    url:
      "/pages/mine/identity/company?unionId=" +
      unionId.value +
      "&from=enterprise",
  });
};
const goRule = () => {
  uni.navigateTo({
    url: "./agreement?unionId=" + unionId.value,
  });

  // uni.navigateTo({
  //   url: '/pages/mine/rule?unionId='+unionId.value+ '&from=organization'
  // })
};
const goIntroduce = () => {
  uni.navigateTo({
    url: "./introduce?unionId=" + unionId.value,
  });
};

// 前往推荐单位
const goRecommended = () => {
  uni.navigateTo({
    url: `./recommended?unionId=${unionId.value}&orgId=${params.orgId}`,
  });
};
const goBase = () => {
  uni.navigateTo({
    url: "./base?unionId=" + unionId.value,
  });
};

const goCharge = () => {
  uni.navigateTo({
    url: "./chargeperson?unionId=" + unionId.value,
  });
};
const getEnterpriseDetail = async () => {
  const result = await service.certification.getEnterpriseDetail({
    id: unionId.value,
  });
  Object.assign(params, result);
  if (result !== null && result !== undefined) {
    fullLogo.value = result.avatar
      ? config.ASSETS_BASE_URL + result.avatar
      : ""; // 补全图片
    fullSignature.value = result.signatureUrl
      ? config.ASSETS_BASE_URL + result.signatureUrl
      : ""; // 补全图片
  }
};

const goSubmit = async () => {
  if (!agreeFlag.value) {
    uni.showToast({
      icon: "none",
      title: "请勾选同意将以上资料同步于投盟链",
    });
    return;
  }
  if (isSubmit) {
    return;
  }
  isSubmit = true;
  uni.showLoading({});
  try {
    const result = await service.certification.addEnterprise({
      id: unionId.value,
    });
    setTimeout(() => {
      uni.hideLoading();
      uni.redirectTo({
        url: "./certification-state"
      });
      isSubmit = false;
    }, 500);
  } catch (error) {
    isSubmit = false;
  }
};

const previewImage = (url: string) => {
  uni.previewImage({
    current: url,
    urls: [url],
  });
};
onLoad(async (options) => {
  unionId.value = options.unionId || "";
});
onShow(() => {
  getEnterpriseDetail();
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
    flex-grow: 1;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .action-value {
    max-width: 520rpx;
    min-width: 520rpx;
    word-break: break-all;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .action-content {
    border-top: 1rpx solid #ece7e3;
  }
  .action-title {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .edit {
      width: 36rpx;
      height: 36rpx;
      min-width: 36rpx;
    }
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
.theme-color {
  color: #12c287;
}

.min-height {
  height: unset !important;
  .introduce {
    padding-top: 20rpx;
  }
}
.obey {
  border-radius: 12rpx;
}
.agree {
  background-color: #fff2de;
  color: #ff9f00;
}
.default-agree {
  background-color: #dcdcdc;
}
.head-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  overflow: hidden;
  max-width: 70rpx;
  min-width: 70rpx;
}

.label {
  min-width: 120rpx;
}
.value {
  word-break: keep-all;
  text-align: right;
}
.value-item {
  padding: 0 16rpx;
  position: relative;
  &:after {
    content: "";
    width: 1rpx;
    height: 20rpx;
    background-color: #c6c6c6;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &:last-child {
    padding-right: 0;
  }
}
.no-content {
  &:after {
    content: none;
  }
}

.picture {
  .pic {
    position: relative;
    margin-right: 32rpx;
    .img {
      max-width: 162rpx;
      min-width: 162rpx;
      height:108rpx;
      border-radius: 6rpx;
      overflow: hidden;
      display: block;
    }
    .del-icon {
      width: 32rpx;
      height: 32rpx;
      position: absolute;
      top: -16rpx;
      right: -16rpx;
    }
  }
}
.logo {
  min-width: 74rpx;
  width: 74rpx;
  height: 74rpx;
  border-radius: 50%;
  display: block;
  margin-right: 20rpx;
}
.edit {
  width: 36rpx;
  height: 36rpx;
  min-width: 36rpx;
}

.agree {
  background-color: #fff2de;
  color: #ff9f00;
}
.checked {
  width: 26rpx;
  height: 26rpx;
  border: 2rpx solid #ff9f00;
  position: relative;
  border-radius: 50%;
}
.selected {
  &:after {
    content: "";
    width: 12rpx;
    height: 12rpx;
    background: #ff9f00;
    position: absolute;
    left: 50%;
    top: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
