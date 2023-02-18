<template>
  <view class="page-search">
    <ym-search-bar
      v-model="searchValue"
      :maxlength="100"
      :focus="props.focus"
      :placeholder="props.placeholder"
      :cancel-back="props.cancelBack"
      clear-button="auto"
      cancel-button="none"
      @confirm="handleSearchConfirm"
      @cancel="handleSearchCancel">
    </ym-search-bar>
    <view v-if="logList.length" class="search-group">
      <view class="search-group__name">
        <text>搜索历史</text>
        <view class="test-delete-log-all" @click="handleLogDeleteAll">
          <image src="../../assets/mine/clear.png"></image>
        </view>
      </view>
      <view class="search-group__content">
        <view v-for="log in logList" :key="log.value" class="search-item" @click="handleLogClick(log)">{{ log.label }}</view>
        <view v-if="props.logs && props.logs.length > 10" class="search-item-opened" @click="handleLogAllOpenClick">{{ logAllOpened ? '收起' : '展开全部' }}</view>
      </view>
    </view>
    <ym-empty v-else title="暂无搜索记录"></ym-empty>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import vueSetupModelValueProxy from '@/utils/vueSetupModelValueProxy'

interface Log {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  /** 双向绑定 */
  modelValue?: string
  /** 获取焦点 */
  focus?: boolean
  /** 搜索历史 */
  logs?: Log[]
  /** 搜索历史 */
  autoLogs?: boolean
  /** 搜索提示 */
  placeholder?: string
  /** 取消后退 */
  cancelBack?: boolean
}>(), {
  modelValue: '',
  focus: false,
  logs: () => [],
  autoLogs: false,
  cancelBack: true
})

const emit = defineEmits<{
  /** 双向绑定 */
  (e: 'update:modelValue', value: string): void
  /** 确认搜索事件 */
  (e: 'confirm', value: string): void
  /** 删除全部记录 */
  (e: 'delete-log-all', value: string): void
  /** 取消事件 */
  (e: 'cancel'): void
}>()

// 搜索框
let searchValue = vueSetupModelValueProxy(props, emit, '')

// 取消搜索
const handleSearchCancel = function () {
  if (props.cancelBack) return uni.navigateBack({ delta: 1 })
  return emit('cancel')
}

// 确认搜索
const handleSearchConfirm = function (value: string) {
  return emit('confirm', value)
}

const logAllOpened = ref(false)
const logList = computed(() => {
  const logs = props.logs || []
  return logAllOpened.value ? logs : logs.slice(0, 10)
})

// 点击记录
const handleLogAllOpenClick = function () {
  logAllOpened.value = !logAllOpened.value
}

// 删除全部记录
const handleLogDeleteAll = function (value: string) {
  return emit('delete-log-all', value)
}

// 点击记录
const handleLogClick = function (log: Log) {
  searchValue.value = log.value
  return handleSearchConfirm(log.value)
}


</script>

<style lang="scss" scoped>
.page-search {
  min-height: 100vh;
}

.search-group {
  padding: 40rpx 32rpx;
  .search-group__name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    line-height: 36rpx;
    margin: 12rpx 0 24rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  &__content {}
}

.test-delete-log-all {
 /*  color: $--ym-color-primary; */
  cursor: pointer;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  image{
    width: 32rpx;
    height: 32rpx;
  }

}

.search-item {
  display: inline-block;
  background: #fff;
  border-radius: 80rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 12rpx 22rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #333333;
  line-height: 32rpx;
  box-sizing: border-box;
  max-width: 100%;
}

.search-item-opened {
  display: inline-block;
  border-radius: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 12rpx 22rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: $--ym-color-primary;
  line-height: 32rpx;
  box-sizing: border-box;
  max-width: 100%;
}



</style>
