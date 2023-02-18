<template>
  <view >
    <view class="u-p-y-20 bg-white">
    <ym-cell
      :label="params.label"
      :padding="true"
      align="right"
      :border="true"
      >
      <input v-model="params.value" class="cell-content-input"  placeholder="请输入" :maxlength="params.maxlength" :border="false" />
    </ym-cell>
    <ym-cell
      label="是否公开"
      :padding="true"
      align="right"
      :border="true"
      >
      <!-- public shield -->
        <switch color="#00CD85" :checked="params.status == 'public'? true: false" @change="switchChange" />
    </ym-cell>
    </view>
  <view class="wrap u-m-t-60">
    <view @click="goBack" class="next-btn">确定</view>
  </view>
  </view>

</template>

<script setup lang="ts">
  import {ref,reactive,computed} from 'vue'
  import { onLoad,onShow } from "@dcloudio/uni-app";
  import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
  import { isInit,isNumber, isPhone, isTelPhone, isEmail } from '@/utils/regex'
  
  const params:any =reactive( {
    label: '',
    value: '',
    status: '',
    maxlength: '',
    ruleType: '',
    required: ''
  })
  const switchChange = (e:any) => {
     params.status = e.detail.value == true ? 'public' : 'shield'
  }
  const goBack = () => {
    if (params.required == false || params.required == 'false') {
      if (params.ruleType === 'email') {
        uni.$emit('features-page:updateEmail',{ value:params.value, status:params.status})
        uni.navigateBack({
          delta:1
        })
      } else {
        uni.$emit('features-page:updatePhone', { value:params.value, status:params.status})
        uni.navigateBack({
          delta:1
        })
      }
     
    } else {
       if (params.value === '' || params.value === undefined || params.value === null) {
        uni.showToast({
          icon: 'none',
           title: `${params.label}不能为空`
        })
        return
      } else {
        // 'text' | 'email' | 'phone'| 'tel'| 'telOrphone'
       if (params.ruleType === 'email' &&!isEmail(params.value)) {
            uni.showToast({
              icon: 'none',
              title: '请输入合法邮箱'
            })
            return false
       }
        if (params.ruleType === 'phone' &&!isPhone(params.value)) {
          uni.showToast({
            icon: 'none',
            title: '请输入合法手机号'
          })
          return false
        }

        if (params.ruleType === 'tel' &&!isTelPhone(params.value)) {
              uni.showToast({
                icon: 'none',
                title: '请输入正确的固话'
              })
            return false
            } 
        if (params.ruleType === 'telOrphone' &&!(isPhone(params.value) || isTelPhone(params.value))) {
            uni.showToast({
              icon: 'none',
              title: '请输入合法的固定电话或者手机号码'
            })
            return false
        }
      
       if (params.ruleType === 'email') {
          uni.$emit('features-page:updateEmail',{ value:params.value.replace(/\s/g, ''), status:params.status})
          uni.navigateBack({
            delta:1
          })
        } else {
          uni.$emit('features-page:updatePhone', { value:params.value.replace(/\s/g, ''), status:params.status})
          uni.navigateBack({
            delta:1
          })
        }
      }
    }
  }
  onLoad((options:any) => {
    Object.assign(params, options)
  })
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
</style>