<template>
  <!-- 评分 -->
  <div class="score" :class="{'readonly': readonly}">
    <div class="score__label">{{name}}</div>
    <div class="score__value">
      <!-- 此循环谨慎添加 :key 属性，此处特意不加key值使其每次更改数据数据时刷新全部循环的dom -->
      <image class="image" :src="e" v-for="(e, i) in scoreArr" :key="i"  @click="handleClickImg(i+1)" />
    </div>
    <div class="score__text" v-if="!readonly">
      {{scoreScale[value]}}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, Ref, ref, watch, computed, ComputedRef } from 'vue'
  import ha from '../../assets/img/high-active.png'
  import h from '../../assets/img/high.png'
  import ma from '../../assets/img/middle-active.png'
  import m from '../../assets/img/middle.png'
  import la from '../../assets/img/low-active.png'
  import l from '../../assets/img/low.png'
  interface Item {
    itemName: string,
    itemValue: number
  }
  type List = Item[]
  const props = withDefaults(defineProps<{
    name?: string,
    value?: number,
    readonly?: boolean,
    scale?: List,
    orderIndex: number
  }>(), {
    name: '评分',
    value: 0, // 注意评分是不能为0的，但是可以为空，所以value为0时代表评分为空
    readonly: false,
    scale: () => [
      {itemName:'暂无评分',itemValue: 0},
      {itemName:'一般',itemValue: 1},
      {itemName:'一般',itemValue: 2},
      {itemName:'良好',itemValue: 3},
      {itemName:'良好',itemValue: 4},
      {itemName:'优秀',itemValue: 5}
    ] 
  })

  // 初始化评分项
  const scoreScale: ComputedRef<string[]> = computed(()=>{
    let scale = []
    let text = ['暂无评分','一般', '一般', '良好', '良好', '优秀']

    for(let i=0; i<6; i++){
      let score = props.scale.filter(item => item.itemValue===i)
      if(score.length > 0){
        scale.push(score[0].itemName ? score[0].itemName : text[i])
      } else {
        scale.push(text[i])
      }
    }

    return scale
  })

  const scoreArr: Ref<Array<number> | null> = ref([])

  watch(() =>props.value, () => {
    updateScoreArr()
  })
   
  onMounted (() => {
    updateScoreArr()
  })

  // 更新分值显示
  function updateScoreArr(){
    scoreArr.value = [l, l, m, m, h].map((i, index:number) => {
      return props.value !== 0 && props.value > index ? [0, la, la, ma, ma, ha][props.value] : i
    })
  }

  // 点击评分
  const handleClickImg = function (i: number) {
    !props.readonly && emit('change', i, props.orderIndex)
  }

  const emit = defineEmits<{
    (e: 'change', i: number, index:number): void
  }>()
  
</script>

<style lang="scss" scoped>
.score{
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .score__label{
    font-size: 26rpx;
    font-weight: 400;
    color: #999999;
    margin-right: 36rpx;
  }

  .score__value{
    flex-grow: 1;
    display: flex;
    align-items: center;
    .image{
      width: 48rpx;
      height: 48rpx;
      margin-right: 28rpx;
    }
  }

  .score__text{
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
    margin-right: 2rpx;
  }

  &.readonly{
    .score__value{
      .image{
        width: 32rpx;
        height: 32rpx;
        margin-right: 10rpx;
      }
    }
  }
  
}
</style>