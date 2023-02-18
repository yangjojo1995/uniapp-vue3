<template>
  <uni-swiper-dot :current="bannerCurrent" :info="bannerList" :dotsStyles="bannerDotsStyles">
    <swiper class="swiper" :autoplay="props.autoplay" :interval="props.interval" :duration="props.duration" :circular="props.circular" @change="handleChange">
      <swiper-item v-for="item in bannerList" :key="item.id" @click="goTo(item)">
        <image class="image" :src="assets(item.image)" :lazy-load="props.lazyLoad" :mode="props.mode" />
      </swiper-item>
    </swiper>
  </uni-swiper-dot>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useService,useRouter } from '@/plugins/app-core'
import assets from '@/utils/assets'
const props = withDefaults(defineProps<{
  /** 当前所在滑块的 index */
  modelValue?: number
  /** 列表 */
  list?: string[] | { url: string, title?: string }[],
  /** 是否自动切换 */
  autoplay?: boolean
  /** 自动切换时间间隔 */
  interval?: number
  /** 滑动动画时长 */
  duration?: number
  /** 是否采用衔接滑动，即播放到末尾后重新回到开头	 */
  circular?: boolean
  /** 图片模式 */
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
  /** 图片懒加载。只针对page与scroll-view下的image有效	 */
  lazyLoad?: boolean,
  /** 圆角 */
  borderRadius: number
}>(), {
  modelValue: 0,
  list: () => [],
  autoplay: true,
  interval: 3000,
  duration: 200,
  circular: false,
  mode: 'scaleToFill',
  lazyLoad: true,
  borderRadius: 0
})

const service = useService()
const emit = defineEmits<{
  /** 双向绑定 */
  (e: 'update:modelValue', value: number): void
  /** 改变事件 */
  (e: 'change', event: any): void
}>()
const router = useRouter()
const bannerCurrent = ref(props.modelValue)

const styleBorderRadius = computed(() => {
  return uni.upx2px(props.borderRadius) + 'px'
})

const bannerList:any = computed(() => {
  const bannerList = props.list
  return bannerList
})

const bannerDotsStyles = reactive({
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  selectedBackgroundColor: '#ffffff'
})

const handleChange = (event: any) => {
  bannerCurrent.value = event.detail.current
  emit('update:modelValue', bannerCurrent.value)
  emit('change', event)
}
const goTo = async (item: any) => {
  if(item.internalLinkType==='activity') {
      router.push({ path: '/pages/activity/detail', query: { id: item.internalLink } })
  }else if(item.internalLinkType==='project') {
     await service.project.projectView({id:item.internalLink})
     router.push({ path: '/pages/project/detail', query: { id: item.internalLink } })
  }
 
}
watch(() => props.modelValue, () => {
  bannerCurrent.value = props.modelValue || 0
})
</script>

<style lang="scss" scoped>
.swiper {
  height: 248rpx;
  border-radius: v-bind('styleBorderRadius');
  overflow: hidden;
}
.image {
  border-radius: v-bind('styleBorderRadius');
  display: block;
  width: 100%;
  height: 100%;
}
</style>
