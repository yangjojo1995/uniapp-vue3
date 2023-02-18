<template>
  <uni-load-more
    :status="status"
    :showIcon="showIcon"
    :iconType="iconType"
    :iconSize="iconSize"
    :color="color"
    :contentText="contentText"
    :showText="showText">
  </uni-load-more>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
  props: {
    status: {
      // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
      type: String,
      default: 'more'
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    iconType: {
      type: String,
      default: 'auto'
    },
    iconSize: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: '#777777'
    },
    contentText: {
      type: Object,
      default () {
        return {
          contentdown: '',
          contentrefresh: '',
          contentnomore: '- 没有更多数据了 -'
        }
      }
    },
    showText: {
      type: Boolean,
      default: true
    }
  }
})
</script>
