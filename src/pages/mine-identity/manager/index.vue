<template>
  <view class="my-base-card">
    <view class="action-list u-p-x-26 bg-white u-m-b-20  u-m-t-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goBase">基本信息
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content" v-if="fullAvatar">
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">头像</text>
          <view class="flex-1 flex jc-end">
            <image :src="fullAvatar" class="logo"></image>
          </view>
        </view>
        <view class="flex jc-between u-m-b-32" v-if="params.investInstitution">
          <text class="text-color-third fs-28 label">所属机构</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{ params.investInstitution }}</text>
        </view>
        <view class="flex jc-between u-m-b-32" v-if="params.position">
          <text class="text-color-third fs-28 label">职位</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{ params.position }}</text>
        </view>
        <view class="flex jc-between u-m-b-32" v-if="params.phone">
          <text class="text-color-third fs-28 label">联系电话</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{ params.phone }}</text>
        </view>
        <view class="flex jc-between  u-m-b-32" v-if="params.email">
          <text class="text-color-third fs-28 label">联系邮箱</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{ params.email }}</text>
        </view>
        <view class="flex jc-between">
          <text class="text-color-third fs-28 label">所属地区</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{ params.belongProvinceStr }}{{ params.belongCityStr }}</text>
        </view>
      </view>

    </view>

    <!-- 个人简介 -->
    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goIntroduce">个人简介
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="action-content" v-if="params.summary">
        <ym-project-collsage :showExpand="true" :nopadding="true" :content="params.summary"></ym-project-collsage>
      </view>
    </view>

    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goFavor">投资偏好
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="u-p-y-50 action-content" v-if="params.investment ? true : false">
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">关注地区</text>
          <view class="text-color-secondary fs-28 value flex-1 text-right">
            {{ mapJoin(params.focusAreasStr, 'cityIdStr') }}
          </view>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">投资领域</text>
          <view class="text-color-secondary fs-28 value flex-1  text-right">
            {{ mapJoin(params.investFieldsStr, 'itemName') }}
          </view>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">投资轮次</text>
          <view class="text-color-secondary fs-28 value flex-1  text-right">
            {{ mapJoin(params.investRoundsStr, 'itemName') }}
          </view>
        </view>
        <view class="flex jc-between">
          <text class="text-color-third fs-28 label">单笔投额</text>
          <text class="text-color-secondary fs-28 word-break text-right">{{ params.investment }}</text>
        </view>
      </view>
    </view>

    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary bold u-p-y-48" @click="goInvite">邀请确权人
        <image class="edit" src="../../../assets/certification/go-edit.png" />
      </view>
      <view class="action-content u-p-y-50" v-if="params.confirmRightManagers.length != 0 || params.confirmRightInstitutions.length != 0">
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">投资经理</text>
          <view class="text-color-secondary fs-28 value flex-1 text-right">
            {{ mapJoin(params.confirmRightManagers, 'representativeIdStr') }}
          </view>
        </view>
        <view class="flex jc-between u-m-b-32">
          <text class="text-color-third fs-28 label">投资机构</text>
          <view class="text-color-secondary fs-28 value flex-1 text-right">
            {{ mapJoin(params.confirmRightInstitutions, 'representativeIdStr') }}
          </view>
        </view>
      </view>
    </view>

    <view class="action-list u-p-x-32 bg-white u-m-b-20">
      <view class="action-title fs-36 text-color-primary  u-p-y-48" @click="goRule">
        <text class="bold u-m-r-10">自我承诺签名</text>
        <text class="text-color-third fs-28 introduce flex-1 flex">
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
        <view class="checked u-m-r-4" :class="agreeFlag == false ? '' : 'selected'"></view>
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
  onUnload,
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
const fullAvatar = ref("");
const unionId = ref("");
const fullSignature = ref("");
const service = useService();
const config = useConfig();
let limit: any = ref();
let limit2: any = ref();
let min: any = ref();
let min2: any = ref();
const params = reactive({
  confirmRightManagers: [],
  confirmRightInstitutions: [],
});
let confirmRightManagers: any = reactive([]);
let confirmRightInstitutions: any = reactive([]);
let isSubmit = false;

function mapJoin(array: Array<{ [key: string]: any }>, key: string) {
  if (array !== null && array.length !== 0) {
    return array.map((item) => item[key]).join("、");
  } else {
    return "";
  }
}
const goRule = () => {
  uni.navigateTo({
    url: "./agreement?unionId=" + unionId.value,
  });
};
const goInvite = () => {
  uni.$once("features-page/invite:confirm", (data: any) => {
    confirmRightManagers = data.mangers;
    confirmRightInstitutions = data.organization;
    submitCooperation();
  });
  const managers = params.confirmRightManagers
    .map((item: any) => item.representativeId)
    .join(",");
  const organizations = params.confirmRightInstitutions
    .map((item: any) => item.representativeId)
    .join(",");

  uni.navigateTo({
    url:
      "/pages/features-page/inviteDraf?managers=" +
      managers +
      "&organizations=" +
      organizations +
      "&notIn=true" +
      "&limit=" +
      limit.value +
      "&limit2=" +
      limit2.value +
      "&min=" +
      min.value +
      "&min2=" +
      min2.value,
  });
};
const goIntroduce = () => {
  uni.navigateTo({
    url: "./introduce?unionId=" + unionId.value,
  });
};
const goBase = () => {
  uni.navigateTo({
    url: "./base?unionId=" + unionId.value,
  });
};

const goFavor = () => {
  uni.navigateTo({
    url: "./favor?unionId=" + unionId.value,
  });
};

const getManagerDetail = async () => {
  const result = await service.certification.getManagerDetail({
    id: unionId.value,
  });
  Object.assign(params, result);
  if (result !== null && result !== undefined) {
    fullAvatar.value = result.avatar
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
    return false;
  }
  isSubmit = true;
  uni.showLoading({});
  try {
    const result = await service.certification.addManager({
      id: unionId.value,
    });
    setTimeout(() => {
      uni.hideLoading();
      uni.redirectTo({
        url: "/pages/mine-identity/manager/authentication",
      });
    }, 500);
  } catch (error) {
    isSubmit = false;
  }
};
const submitCooperation = async () => {
  const result = await service.certification.addManagerDraft({
    id: unionId.value,
    confirmRightManagers: confirmRightManagers.map((item: any) => item.id),
    confirmRightInstitutions: confirmRightInstitutions.map(
      (item: any) => item.id
    ),
  });
  getManagerDetail();
};

const previewImage = (url: string) => {
  uni.previewImage({
    current: url + "?original=true",
    urls: [url + "?original=true"],
  });
};
const getDictionaryLimit = async (code: any) => {
  const result = await service.app.getDictionary({ dictCode: code });
  result.forEach((key: any) => {
    if (key.itemValue === "jg_max") {
      limit2.value = key.description * 1;
    }
    if (key.itemValue === "jl_max") {
      limit.value = key.description * 1;
    }
    if (key.itemValue === "jl_min") {
      min.value = key.description * 1;
    }
    if (key.itemValue === "jg_min") {
      min2.value = key.description * 1;
    }
  });
};
onLoad(async (options) => {
  unionId.value = options.unionId || "";
});
onShow(() => {
  getDictionaryLimit("assist_number");
  getManagerDetail();
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
  color: $--ym-color-primary;
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
  word-break: break-all;
  text-align: right;
  letter-spacing: 1rpx;
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
