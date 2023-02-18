<template>
  <!-- 点评内容 -->
  <div class="comment" :class="{'comment--hide-border': hideBorder}" @click="handleClick">

    <!-- 列表 -->
    <template v-if="type==='default'">
      <!-- 用户信息 -->
      <headerPublic :item="item"></headerPublic>
      <!-- 评分 -->
      <ac-score :value="item.score" :readonly="true"></ac-score>
      <!-- 点评内容 -->
      <content :item="item"></content>
      <!-- 点赞 -->
      <ac-praise 
        :likesUsers="item.likesUsers.commentUsers" 
        :likeStatus="likeStatus"
        :commentId="item.id"
        @updateLike="updateLike">
      </ac-praise>
    </template>

    <!-- 详情 -->
    <template v-if="type==='detail'">
      <!-- 用户信息 -->
      <headerPublic :item="item"></headerPublic>
      <!-- 评分 -->
      <ac-score :value="item.score" :readonly="true"></ac-score>
      <!-- 详细评分 -->
      <scoreLine :commentScoringList="item.commentScoringList"></scoreLine>
      <!-- 点评内容 -->
      <content :item="item" :preview="true"></content>
      <!-- 点赞 -->
      <ac-praise 
        :likesUsers="item.likesUsers.commentUsers" 
        :likeStatus="likeStatus" 
        :commentId="item.id"
        @updateLike="updateLike">
      </ac-praise>
    </template>

    <!-- 我的点评 -->
    <template v-if="type==='myComment'">
      <!-- 简要用户信息 -->
      <headerSimple :item="item"></headerSimple>
      <!-- 评分 -->
      <ac-score :value="item.score" :readonly="true"></ac-score>
      <!-- 点评内容 -->
      <content :item="item" ></content>
      <!-- 点评对象 -->
      <div class="comment__from">{{item.bindObject.bindTypeStr}}：{{item.bindObject.desc}}</div>
      <!-- 点赞 -->
      <ac-praise :likesUsers="item.likesUsers.commentUsers" 
        :likeStatus="likeStatus" 
        :commentId="item.id" 
        @updateLike="updateLike">
      </ac-praise>
    </template>

    <!-- 我的点赞 -->
    <template v-if="type==='myPraise'">
      <!-- 简要用户信息 -->
      <headerSimple :item="item" type="myPraise"></headerSimple>
      <!-- 点评内容 -->
      <content :item="item.commentObject"></content>
      <!-- 点评对象 -->
      <div class="comment__from">{{item.bindObject.bindTypeStr}}：{{item.bindObject.desc}}</div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, onMounted } from 'vue'
  import headerPublic from "./header-public.vue";
  import headerSimple from "./header-simple.vue";
  import content from "./content.vue";
  import scoreLine from "./score-line.vue";

  const props = withDefaults(defineProps<{
    item: CommentItem,
    hideBorder?: boolean, // 是否列表第一项，即是否隐藏顶部分割线
    type?: 'default' | 'myComment' | 'myPraise' | 'detail' // 类型，列表项，点评
  }>(), {
    hideBorder: true,
    type: 'default' 
  })

  const emit = defineEmits<{ 
    (e: 'updateLike', status: boolean, id: string): void
  }>()

  const handleClick = function (event: Event) {
    !!(props.type !== 'detail') && (uni.navigateTo({ url: '/plugins/app-comment/packages/detail/detail?id=' + (props.type ==='myPraise'? props.item.commentId: props.item.id) }))
  }

  // 点赞状态，是否已点赞
  let likeStatus: Ref<boolean> = ref(false)
  onMounted (() => {
    likeStatus.value = props.item.likeStatus === 1
  }) 
  function updateLike(status: boolean){
    likeStatus.value = status
    emit('updateLike', status, props.item.id)
  }
</script>

<style lang="scss" scoped>

.comment{
  padding: 32rpx 0;
  border-top: 2rpx solid #F2F2F2;
  &.comment--hide-border{
    border-top: none;
    padding-top: 0;
  }

  .comment__from{
    margin-top: 18rpx;
    padding-left: 11rpx;
    font-size: 24rpx;
    height: 24rpx;
    font-weight: 400;
    color: #999999;
    line-height: 1;
    border-left:4rpx solid #999;
  }
}

</style>