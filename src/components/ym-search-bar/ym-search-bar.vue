<template>
  <view class="search-bar" :class="classData">
    <view v-if="props.clickable" class="search-bar__clickable" @click="handleClick"></view>
    <uni-search-bar
      class="uni-search-bar"
      ref="searchBar"
      v-model="currentSearchValue"
      :placeholder="props.placeholder"
      :clear-button="props.clearButton"
      :cancel-button="props.cancelButton"
      :focus="props.focus"
      radius="100"
      bg-color="#ffffff"
      @focus="handleSearchFocus"
      @blur="handleSearchBlur"
      @confirm="handleSearchConfirm"
      @clear="handleSearchClear"
      @cancel="handleSearchCancel">
    </uni-search-bar>
  </view>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, computed, watch, nextTick, useAttrs, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  /** 双向绑定 */
  modelValue?: string
  /** 获取焦点 */
  focus?: boolean
  /** 搜索提示 */
  placeholder?: string
  /** 清除按钮 */
  clearButton?: 'always' | 'none' | 'auto'
  /** 取消按钮 */
  cancelButton?: 'always' | 'none' | 'auto'
  /** 取消后退 */
  cancelBack?: boolean
  /** 点击反馈 */
  clickable?: boolean
  /** 悬浮 */
  sticky?: boolean
}>(), {
  modelValue: '',
  focus: false,
  placeholder: '请输入搜索内容',
  clearButton: 'auto',
  cancelButton: 'always',
  cancelBack: true,
  clickable: false,
  sticky: false
})

const emit = defineEmits<{
  /** 双向绑定 */
  (e: 'update:modelValue', value: string): void
  /** 确认搜索事件 */
  (e: 'confirm', value: string): void
  /** 取消事件 */
  (e: 'cancel'): void
  /** 点击事件 */
  (e: 'click'): void
}>()

const classData = computed(() => {
  return {
    'search-bar--sticky': props.sticky,
    'search-bar--clickable': props.clickable,
    [`search-bar--clear-${props.clearButton}`]: props.clearButton,
    [`search-bar--cancel-${props.cancelButton}`]: props.cancelButton
  }
})

// 搜索框 ref 实例
let searchBar = <Ref<null|{ searchClick(): any }>>ref(null)

onMounted(() => {
  // if (!props.clickable && props.focus) {
  //   searchBar.value?.searchClick()
  // }
})

// 搜索框值
let currentSearchValue = ref(props.modelValue)
// 搜索值
let searchValue = ref(props.modelValue)

watch(() => props.modelValue, (value) => {
  currentSearchValue.value = value
  searchValue.value = currentSearchValue.value
})

watch(() => searchValue.value, (value) => {
  // if (value === currentSearchValue.value) return
  emit('update:modelValue', value)
})

// 获取焦点
const handleSearchFocus = function () {
  currentSearchValue.value = searchValue.value
}

// 失去焦点
const handleSearchBlur = function () {
  setTimeout(() => {
    currentSearchValue.value = searchValue.value
  })
}

// 取消搜索
const handleSearchCancel = function () {
  if (props.cancelBack) {
    return uni.navigateBack({ delta: 1 })
  }
  currentSearchValue.value = ''
  searchValue.value = ''
  nextTick(() => {
    searchBar.value?.searchClick()
  })
  return emit('cancel')
}

// 清除搜索
const handleSearchClear = function () {
  currentSearchValue.value = ''
  searchValue.value = ''
}

// 确认搜索
const handleSearchConfirm = function () {
  searchValue.value = currentSearchValue.value
  return emit('confirm', searchValue.value)
}

// 点击
const handleClick = function () {
  return emit('click')
}

</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  &__clickable {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    z-index: 3;
  }
}

.search-bar--sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-bar--clickable {
  &.search-bar--cancel-always {
    .search-bar__clickable {
      right: 110rpx;
    }
  }
}
</style>
