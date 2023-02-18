<template>
  <!-- 点赞栏 -->
  <div class="praise" v-if="ready">
    <div class="praise__left" v-if="praiseUser.length>0">
      <div class="praise__left__person">
        <image class="image" :src="assets(ele.commentUserIcon)" v-for="ele in showUserArr" :key="ele.commentUserId" />
        <div v-if="praiseUser.length>5" class="praise__left__person__more">···</div>
      </div>
      <div class="praise__left__text">
        等{{praiseUser.length}}人点赞
      </div>
    </div>
    <div class="praise__left" v-else>
      <div style="padding-left: 6rpx">成为第一个点赞人</div>
    </div>
    <div class="praise__right" @click.stop="changePraise" :class="{'green-bg': likeStatus}">
      <image class="image" :src=" likeStatus ? pa : p" :class="{'click-rote': changeAnimate}"></image>
      <text>{{likeStatus ? '已点赞' : '点赞'}}</text>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, computed, onMounted, watch } from 'vue'
  import assets from '../../lib/assets';
  import { acUseService } from '../../lib/app-core'
  import pa from "../../assets/img/praise-active.png";
  import p from "../../assets/img/praise.png";
  const acService = acUseService()

  let ready = ref(false)

  const props = withDefaults(defineProps<{
    commentId: string,
    likesUsers: Array<Required<CommentUsersItem>>,
    likeStatus: boolean
  }>(), {
  })

  watch(() => props.likeStatus, () => updatePraiseData)

  // 点赞状态，为 true 则表示已点赞
  // let praiseFlag: Ref<boolean> = ref(false)
  // 当前点赞用户
  let praiseUser: Ref<Array<CommentUsersItem>> = ref([])
  // 显示点赞的头像数量。如果点赞数量是一个三位及以上的整数，则只显示是个头像；如果点赞数量不足百，则显示五个头像
  let limitNumber: Ref<number> = ref(0)
  // 显示的头像数组
  let showUserArr: Ref<Array<CommentUsersItem>> = ref([])

  // 更新赞数据
  function updatePraiseData(stutus: boolean, likesUsers: Array<CommentUsersItem>){
    // praiseFlag.value = stutus
    praiseUser.value = likesUsers
    limitNumber.value = likesUsers.length > 99 ? 4 : 5
    showUserArr.value = likesUsers.length > limitNumber.value ? likesUsers.slice(0, limitNumber.value) : likesUsers
  }
  onMounted (() => {
    updatePraiseData(props.likeStatus, props.likesUsers)
    ready.value = true
  })

  const emit = defineEmits<{
    (e: 'updateLike', status: boolean): void
  }>()

  // 点赞/取消点赞
  let changeAnimate: Ref<boolean> = ref(false)
  async function changePraise () {
    if(changeAnimate.value) return 
    acService.comment.like({ status: !props.likeStatus, commentId: props.commentId })
      .then((res: Array<CommentUsersItem>) => {
      updatePraiseData(!props.likeStatus, res)
      emit('updateLike', !props.likeStatus)
    })
    changeAnimate.value = true
    setTimeout(() => { changeAnimate.value = false }, 500)
  }

</script>

<style lang="scss" scoped>
.praise{
  display: flex;
  margin-top: 20rpx;
  
  .praise__left{
    flex-grow: 1;
    background: #F6F6F6;
    border-radius: 42rpx;
    height: 84rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    font-size: 22rpx;
    font-weight: 400;
    color: #666666;

    .praise__left__person{
      display: flex;
      align-items: center;
      
      .image{
        width: 40rpx;
        height: 40rpx;
        border-radius: 40rpx;
        border: 2rpx solid #FFFFFF;
        margin-right: 8rpx;
      }

      .praise__left__person__more {
        width: 40rpx;
        height: 40rpx;
        border-radius: 40rpx;
        border: 2rpx solid #FFFFFF;
        margin-right: 8rpx;
        background: #FFFFFF;
        line-height: 40rpx;
        text-align: center;
        color: #A3A3A3;
      }
    }

    .praise__left__text{
      margin-left: 8rpx;
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      align-items: center;
    }
  }

  .praise__right{
    margin-left: 24rpx;
    width: 160rpx;
    height: 84rpx;
    background: #F6F6F6;
    border-radius: 42rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    font-size: 24rpx;
    font-weight: 400;
    color: #00BB3B;
    transition: all ease 0.4s;

    &.green-bg{
      background: #E1F6E3;
    }

    .image{
      width: 28rpx;
      height: 28rpx;
      margin-right: 8rpx;
      margin-left: 32rpx;
      transform-origin: 0 50%;
      
      &.click-rote{
        animation: rete60 0.8s ease forwards;
      }
    }
  }

  @keyframes rete60{
    20%{ transform: rotate(25deg); }
    50%{ transform: rotate(-15deg); }
    75%{ transform: rotate(5deg); }
    100% { transform: rotate(0); }
  }
}

</style>
