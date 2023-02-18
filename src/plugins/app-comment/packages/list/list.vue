<template>
  <div class="ac-card">
    <button @click="goAdd"> 写点评 </button>
    <button @click="goMyComment"> 点评与点赞 </button>
    
    <ac-project-list @goComment="goComment"></ac-project-list>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref } from 'vue'

const goAdd = () => {
  uni.navigateTo({ url: '../form/create' })
}

const goMyComment = () => {
  uni.navigateTo({ url: '../my-comment/my-comment' })
}

// 评论列表跳转详情
const goComment = (id: string) => {
  // uni.navigateTo({ url: '../detail/detail?id=' + id })
}

</script>
<style lang="scss" scoped>
.ac-card{
  padding-left: 26rpx;
  padding-right: 26rpx;
}

</style>