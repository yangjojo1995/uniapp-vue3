<template>
  <div>
    <div class="comment__content" :class="{'ellipsis' : !preview}">
      {{item.content}}
    </div>
    <div class="comment__img" v-if="item.pictureList && item.pictureList.length>0">
      <image class="image" 
        :class="{'image--left' : index === 0 || index === 3 }" 
        v-for="(ele, index) in item.pictureList" :key="ele" 
        :src="assets(ele)"  
        mode="aspectFill"
        @click="preview && previewImg(ele, item.pictureList)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import assets from '../../lib/assets';
  import { previewImg } from '../../utils/preview'


  const props = withDefaults(defineProps<{
    item: commentObjInterface | CommentItem
    preview?: boolean
  }>(), {
    preview: false
  })

</script>

<style lang="scss" scoped>

.comment__content{
  font-size: 26rpx;
  font-weight: 400;
  color: #333333;
  line-height: 40rpx;
  word-break: break-all;
}

.comment__img{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .image{
    width: 200rpx;
    height: 200rpx;
    border-radius: 8rpx;
    margin: 20rpx 0 0 20rpx;

    &.image--left{
      margin-left: 0;
    }
  }
}


.ellipsis {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>