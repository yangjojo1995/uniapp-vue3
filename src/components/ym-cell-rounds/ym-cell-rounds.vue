<template>

  <ym-cell v-if="!props.create" :icon="props.icon" :label="props.label" :align="props.align" :padding="props.padding" :forward="true" :border="props.border" @click="handleClick">
    <template v-if="list.length">
      <view v-if="inline" class="inline">
        {{listStr}}
      </view>
      <view v-else v-for="item,index in list" class="tag" :key="index">
        {{ getLabel(item) }}
      </view>
    </template>
    <view v-if="!list.length">{{ placeholder }}</view>
  </ym-cell>
  <view class="required action-item  u-p-y-48 fs-28" v-else @click="handleClick">
    <view class="flex ai-center jc-between">
      <view class="action-text  text-color-primary">{{props.label}}</view>
      <view class="flex ai-center">
        <view class="action-value text-color-third u-p-r-30 flex jc-end">{{props.placeholder}}</view>
        <image src="../../assets/mine/arrow.png" class="arrow"></image>
      </view>
    </view>
    <view class="select-wrap flex flex-wrap">
      <view class="select-item" v-for="item,idx in list" :key="idx">{{ getLabel(item) }}</view>
    </view>
  </view>

</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useService } from "@/plugins/app-core";

const service = useService();

type List = string[];

const props = withDefaults(
  defineProps<{
    modelValue?: List;
    icon?: string;
    label?: string;
    placeholder?: string;
    align?: "left" | "right";
    disabled?: boolean;
    padding?: boolean;
    border?: boolean;
    inline?: boolean;
  }>(),
  {
    modelValue: () => [] as List,
    placeholder: "请选择",
    disabled: false,
    padding: true,
    border: true,
    inline: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", event: any): void;
}>();

const list = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    list.value = value || [];
  }
);

const listStr = computed(() => {
  return props.modelValue
    .map((item) => {
      return getLabel(item);
    })
    .join("、");
});

const handleClick = (event: any) => {
  uni.$once("features-page/select-rounds:rounds", (data) => {
    list.value = data;
    emit("update:modelValue", list.value);
  });
  console.log(list.value);
  uni.navigateTo({
    url: "/pages/features-page/select-rounds?value=" + list.value,
  });
};

// ====================================

let options: any = reactive([]);

const getDictionaryRound = async (code: any) => {
  const result = await service.app.getDictionary({ dictCode: code });
  result.forEach((key: any) => {
    key.value = key.itemValue;
    key.label = key.itemName;
  });
  options.push(...result);
};

const getLabel = (value: any) => {
  const option = options.find((key: any) => key.itemValue === value);
  return option ? option.itemName : "";
};

onMounted(() => {
  getDictionaryRound("invest_round");
});
</script>

<style lang="scss" scoped>
.cell-content-input {
  display: block;
  font-size: 28rpx;
  font-weight: 400;
  width: 100%;
  color: #333333;
  &:focus {
    outline: none;
    text-align: left;
  }
}

.tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 156rpx;
  min-height: 80rpx;
  background: #f7f7f7;
  border-radius: 12rpx;
  font-size: 22rpx;
  font-weight: 400;
  margin: 10rpx;
  color: #333333;
  text-align: center;
  user-select: none;
  opacity: 1;
  background: #e7f8f2;
  color: #333333;
}

.inline {
  flex-shrink: 0;
  flex-grow: 0;
  width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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
  &:before {
    content: "";
    width: 8rpx;
    height: 36rpx;
    background: $--ym-bg-primary;
    border-radius: 8rpx;
    position: absolute;
    left: -32rpx;
    top: 50%;
    transform: translateY(-50%);
  }
}
.action-item {
  border-bottom: 1rpx solid #ece7e3;
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
</style>
