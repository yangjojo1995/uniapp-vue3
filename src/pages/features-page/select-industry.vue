<template>
   <view class="fileds-wrap">
      <ym-easytag-select-panel title="所属行业" limit="1" v-model="list" :options="options"></ym-easytag-select-panel>
      <view class="footer-btn-wrap">
        <view class="footer-inner">
          <view class="next-btn" @click="submit">确定</view>
        </view>
      </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useService } from '@/plugins/app-core'
import { onLoad } from '@/utils/commonUse'

const service = useService()

let list:any = reactive([])
let required = true
const submit = () => {
  if ( list.length === 0 && required === true) {
    uni.showToast({
      icon: 'none',
      title: '请至少选一选项'
    })
    return
  }
  uni.$emit('features-page/select-industry:industry', list)
  uni.navigateBack({
    delta:1
  })
}

// ====================================

let options:any = reactive([])

const getDictionaryFileds = async (code:any) => {
  const result = await service.app.getDictionary({dictCode: code})
  result.forEach((key:any) => {
    key.value = key.itemValue 
    key.label = key.itemName
  })
  options.push(...result)
}

const getLabel = (value:any) => {
    // const optionsFilter = await service.app.getDictionary({dictCode: 'invest_field'})
    const option = options.find((key:any) =>key.itemValue === value)
    return option!= undefined  ? option.itemName : ''
}

onLoad (async (options:any) => {
  await getDictionaryFileds('industry_type')
  required = options.required == 'true' ? true : false
  const arr:any = options.value?options.value.split(','): []
  list.push(...arr)
})
</script>

<style lang="scss" scoped>

.fileds-wrap{
  position: fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
  z-index: 999;
  background-color: #fff;
}
.footer-btn-wrap{
  position:absolute;z-index: 999;bottom:0;left:0
}
</style>
