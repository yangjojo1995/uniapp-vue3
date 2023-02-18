<template>
  <scroll-view class="tag-select" scroll-y>
    <view v-if="showMarks" class="fs-26 text-color-third u-p-x-32 u-p-t-32">为确保真实，至少邀请{{props.min2}}名投资机构或者{{props.min}}名投资经理确权您的身份信息</view>
    <template v-if="props.options.length>0 && limit>0">
    <view v-if="multiple" class="group-box">
      <view class="group-box__title">
        <text>已选择{{ props.title }}</text>
        <text>（</text>
        <text class="text-primary">{{ checkedOptions.length }}</text>
        <text>/{{ props.limit }}</text>
        <text>）</text>
      </view>
      <view class="group-box__container">
        <template v-if="checkedOptions.length">
          <view class="options">
            <view
              v-for="item in checkedOptions"
              :key="item[props.valueKey]"
              class="options__item show-delete"
              @click="handleSelectOptions(item, false)">
              <slot name="option" :option="item">
                <image :src='assets(item[props.imageKey])' class="icon" />
                <text>{{ item[props.labelKey] }}</text>
              </slot>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="tip">请选择</view>
        </template>
      </view>
    </view>
    <view class="group-box">
      <view v-if="multiple" class="group-box__title">
        <text>请选择{{ props.title }}</text>
        <text>（可多选）</text>
      </view>
      <view class="group-box__container">
        <view class="options">
          <view
            v-for="item in props.options"
            :key="item[props.valueKey]"
            class="options__item"
            :class="{ 'is-active': hasCheckedOption(item) }"
            @click="handleSelectOptions(item)">
            <slot name="option" :option="item">
              <image :src='assets(item[props.imageKey])' class="icon" />
              <text>{{ item[props.labelKey] }}</text>
            </slot>
          </view>
        </view>
      </view>
    </view>
    </template>
    <template v-else>
       <ym-empty></ym-empty>
    </template>
  </scroll-view>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import assets  from '@/utils/assets'


interface Option {
  [key: string]: any
}

const props = withDefaults(defineProps<{
  // 双向绑定的值
  modelValue?: string | number | (string | number)[]
  // 双向绑定数据
  checkedOptions?: Option[]
  // 标题
  title?: string
  // 选项
  options?: Option[]
  // 值 Key
  valueKey?: string
  // 标签 Key
  labelKey?: string
  imageKey?: string
  // 限制选择数量
  limit?: number,
  min?: number,
  min2?: number,
  excludeManager?:Option,
  excludeOrganization?:Option,
  showMarks?:boolean
}>(), {
  title: '',
  valueKey: 'value',
  labelKey: 'label',
  options: () => [],
  checkedOptions: () => [],
  limit: 1,
  min:3, // 最少选择投资经理数
  min2:1, // 最少选择投资机构数
  showMarks: true
})

const emit = defineEmits<{
  (e: 'checked-options', value: typeof props['checkedOptions']): void
  (e: 'update:modelValue', value: typeof props['modelValue']): void
}>()

const multiple = computed(() => props.limit > 1)

const checkedOptions: Option[] = reactive(props.checkedOptions)
const hasCheckedOption = function (option: Option) {
  return checkedOptions.some(item => item[props.valueKey] === option[props.valueKey])
}
const handleSelectOptions = function (option: Option, selected?: boolean) {
  selected = selected == null ? !hasCheckedOption(option) : selected
  if (multiple.value) {
    if (selected) {
      if (!hasCheckedOption(option)) {
        if (checkedOptions.length >= props.limit) {
          return uni.showToast({ title: '最多只能选择' + props.limit + '项', icon: 'none' })
        }
        checkedOptions.push(option)
      }
    } else {
      if (hasCheckedOption(option)) {
        checkedOptions.splice(checkedOptions.findIndex(item => item[props.valueKey] === option[props.valueKey]), 1)
      }
    }
  } else {
    checkedOptions.splice(0)
    checkedOptions.push(option)
  }
}

watch(() => props.checkedOptions, function (checkedOptions) {
  for (const option of checkedOptions) {
    if (!hasCheckedOption(option)) {
      handleSelectOptions(option, true)
    }
  }
})

watch(() => props.modelValue, function (value) {
  if (String(value) === String(checkedOptions.map(i => i[props.valueKey]))) return
  const values = Array.isArray(value) ? value : [value]
  checkedOptions.splice(0)
  for (const value of values) {
    const option = props.options.find(item => item[props.valueKey] === value)
    if (option) {
      handleSelectOptions(option, true)
    }
  }
}, { deep: true, immediate: true })

watch(() => props.options, function () {
  const value = props.modelValue
  if (String(value) === String(checkedOptions.map(i => i[props.valueKey]))) return
  const values = Array.isArray(value) ? value : [value]
  checkedOptions.splice(0)
  for (const value of values) {
    const option = props.options.find(item => item[props.valueKey] === value)
    if (option) {
      handleSelectOptions(option, true)
    }
  }
}, { deep: true })

watch(() => checkedOptions, function (checkedOptions) {
  emit('checked-options', checkedOptions)
  emit('update:modelValue', checkedOptions.map(item => item[props.valueKey]))
}, { deep: true })

</script>

<style lang="scss" scoped>
.tag-select {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .group-box {
    flex: 1;
  }
}

.group-box {
  &__title {
    padding: 32rpx 32rpx 0;
    box-sizing: border-box;
    font-size: 24rpx;
    font-weight: 500;
    color: #333333;
    line-height: 30rpx;
    &:last-child {
      padding-bottom: 32rpx;
    }
  }
  &__container {
    padding: 32rpx;
  }
}

.side-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 98rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  transition: color 0.3s;
  &::before {
    content: '';
    opacity: 0;
    position: absolute;
    left: 0;
    top: 32rpx;
    bottom: 32rpx;
    z-index: 1;
    width: 8rpx;
    margin: auto;
    background-color: #ffffff;
    border-radius: 4rpx;
    transition: background-color 0.3s, opacity 0.3s;
  }


  span {
    display: block;
    font-size: 24rpx;
    color: #333333;
    text-align: center;
    line-height: 30rpx;
  }

  &.is-active {
    color: #333333;
    &::before {
      opacity: 1;
      background: $--ym-bg-primary;
    }
  }
}

.options {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
  &__item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 156rpx;
    min-height: 164rpx;
    background: #F7F7F7;
    border-radius: 12rpx;
    font-size: 22rpx;
    font-weight: 400;
    margin: 10rpx;
    color: #333333;
    text-align: center;
    user-select: none;
    text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 30rpx;
      max-height: 60rpx;
    }

    &::after {
      content: '✓';
      display: block;
      opacity: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: 24rpx;
      height: 24rpx;
      color: #ffffff;
      background-color: #999999;
      border-radius: 0px 12rpx 0px 8rpx;
      font-size: 20rpx;
      line-height: 24rpx;
      text-align: center;
      transition: opacity 0.3s background-color 0.3s;
    }

    &.is-active {
      opacity: 1;
      background: #E7F8F2;
      color: #333333;
      &::after {
        opacity: 1;
        background: $--ym-bg-primary;
      }
    }

    &.show-delete {
      &::after {
        content: '✕';
        opacity: 1;
        color: $--ym-color-primary;
        background: none;
      }
    }

  }
}

.text-primary {
  color: $--ym-color-primary;
}

.tip {
  height: 32rpx;
  line-height: 32rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #999999;
  text-align: center;
}

.icon{
  width: 88rpx;
  height: 88rpx;
  border: 2rpx solid #FFFFFF;
  border-radius: 50%;
  display: block;
  margin-bottom:10rpx;
}
</style>
