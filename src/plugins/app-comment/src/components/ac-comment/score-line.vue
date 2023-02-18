<template>
  <div class="score">
    <template v-for="item in commentScoringList" :key="item.commentScoringItemName">
      <div class="score-label">{{item.commentScoringItemName}}：</div>
      <div class="score-value">{{item.score}}.0</div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, ComputedRef } from 'vue'

  const props = withDefaults(defineProps<{
    commentScoringList: Array<CommentScoringListItem>
  }>(), {
  })

 /*  const scoreList: ComputedRef<Array<CommentScoringListItem>> = computed(()=>{
    return props.commentScoringList
  }) */

</script>

<style lang="scss" scoped>
.score{
  display: flex;
  font-size: 24rpx;
  font-weight: 400;
  margin: 16rpx 0;

  .score-label{
    color: #999999;
    margin-right: 2rpx;
  }
  .score-value{
    color: #333;
    margin-right: 36rpx;
  }
}
</style>