<template>
  <view>
      <view class="dialog-box"></view>
      <view class="org-dialog">
        <view class="org-dialog-title">{{title || '提示'}}</view>
        <view class="org-dialog-content">
          <u-input class="form-card-group-input" :maxlength="maxlength" trim="true" border="false" v-model="content" :placeholder="placeholder"></u-input>
        </view>
        <view class="org-dialog-foot">
          <view class="org-dialog-foot-btn" @click="handleCancel">取消</view>
          <view class="org-dialog-foot-btn" @click="handleSubmit">确定</view>
        </view>
      </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string,
  placeholder: string,
  maxlength: number
}>()

const content = ref('')
const emit = defineEmits<{
  /** 点击事件 */
  (e: 'cancel'): void,
  (e: 'submit', content: string): void
}>()

const handleCancel = function () {
  emit('cancel')
}

const handleSubmit = function () {
  emit('submit',  content.value)
}

</script>

<style lang="scss" scoped>

.dialog-box{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background:rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  position: fixed;
  z-index: 1000000000;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.org-dialog{
  position: fixed;
  background: #fff;
  width: 300px;
  height: 160px;
  transition: all 0.3s ease;
  top: calc(50vh - 80px);
  left: calc(50% - 150px);
  border-radius: 12px;
  z-index: 10000000000;
  box-shadow: 0 -2px 12px 0 rgb(0 0 0 / 10%);
  overflow: hidden;

  .org-dialog-title{
    color: #333;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 24px 0;
    height: 20px;
  }

  .org-dialog-content {
    color: #666;
    font-size: 14px;
    text-align: center;
    height: 20px;
    margin: 24px 0;
    padding: 0 32rpx
  }

  .org-dialog-foot {
    border-top: 1px solid #ddd;
    height: 48px;
    display: flex;

    .org-dialog-foot-btn{
      height: 100%;
      display: flex;
      width: 50%;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 16px;
      font-weight: bold;

      &:nth-child(1){
        border-right: 1px solid #ddd;
      }
    }
  }

}

</style>
