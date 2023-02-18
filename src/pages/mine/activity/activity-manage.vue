<template>
  <view class="manage">
    <ym-activity-item @item-click="goManageDetail(item.id)" v-for="item in listPagingLazy.list" :key="item.id" :item="item">
      <template #buttons>
        <view class="footer-box">
          <view class="footer-btn flex-center red" v-if="['apply', 'progress'].includes(item.status)" @click.stop="handleStop(item.id)">
            <image style="width: 30rpx;" src="../../../assets/activity/stop.png"></image>
            <text>结束</text>
          </view>
          <view class="footer-btn flex-center gray"  @click.stop="" v-else>
            <image style="width: 30rpx;" src="../../../assets/activity/no-stop.png"></image>
            <text>结束</text>
          </view>
          <view class="footer-hr"></view>
          <view class="footer-btn flex-center black" v-if="['apply', 'pre-publish'].includes(item.status)" @click.stop="goEdit(item.id)">
            <image style="width: 30rpx;" src="../../../assets/activity/edit.png"></image>
            <text>编辑</text>
          </view>
          <view class="footer-btn flex-center gray"  @click.stop="" v-else>
            <image style="width: 30rpx;" src="../../../assets/activity/no-edit.png"></image>
            <text>编辑</text>
          </view>
        </view>
      </template>      
    </ym-activity-item>
    <ym-empty v-if="listPagingLazy.isEmpty" text="暂无数据" mode="list"></ym-empty>
    <uni-load-more v-else :status="listPagingLazy.loadStatus"></uni-load-more>

    <ym-input-confirm v-if="showModel" title="告知用户提前结束原因" placeholder="请输入15字内的结束原因" :maxlength="15" @cancel="cancel" @submit="submit"></ym-input-confirm>

    <!-- <ym-footer>
      <view class="footer-btn flex-center gray-bg" @click="goDraft">草稿</view>
      <view class="footer-btn flex-center green-bg" @click="create">发起活动</view>
    </ym-footer> -->
  </view>
</template>

<script setup lang="ts">
import { useService } from '@/utils/commonList'
import { PagingLazy } from '@/utils/paging'
import { ref, reactive } from "vue"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { requireCheck } from '@/utils/toast'

const service = useService()

const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records } = await service.activity.queryMyActivities({ page, size})
  return { total, records }
}))
const goDraft = ():void => {
  uni.navigateTo({url: `./draft-list`})
}

const create = async() => {
  let id = await service.mine.createId()
  uni.navigateTo({url: '/pages/mine/activity/form-base?id=' + id})
}

const goEdit = async (id: string) => {
  uni.removeStorageSync('editActivity');
  uni.navigateTo({url: '/pages/mine/activity/edit-view?id=' + id + '&type=edit'})
}

const goManageDetail = (id: string):void => {
  uni.navigateTo({url: `./detail-manage?id=${id}`})
}


let showModel = ref(false)
let stopId = ref('')
const cancel = () => {
  showModel.value = false
}
const submit = async (content: string) => {
  if(requireCheck('请选择输入结束原因', content)) return
  if(requireCheck('结束原因15字以内', content)) return
  showModel.value = false
  await service.activity.updateActivityStatus({id: stopId.value, status: 'end', reason: content})
  listPagingLazy.refresh()
}
const handleStop = (id: string) => {
  showModel.value = true
  stopId.value = id
}

onLoad(async (query) => {
  listPagingLazy.load()
})

onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh();
})

onReachBottom(() => {
  listPagingLazy.next()
})


</script>

<style lang="scss" scoped>
.manage{
  padding-bottom: 146rpx;
}

.footer-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  
  .footer-hr{
    border-left: 1px solid #C6C6C6;
    height: 20rpx;
  }

  .footer-btn{
    width: 49%;

    image{
      object-fit: contain;
      margin-right: 12rpx;
      height: 30rpx;
    }
    text {
      font-size: 28rpx;
      font-weight: 400;
    }
  }
}
.black {
  color: #333333;
  background: #fff;
}

.red {
  color: #FF4435;
  background: #fff;
}

.gray{
  color: #E9E9E9;
  background: #fff;
}


.footer-btn{
  height: 82rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  margin: 0 32rpx;

  &.gray-bg{
    width: 190rpx;
    height: 82rpx;
    background: #F8F8F8;
    border-radius: 50px;
    border: 1px solid #E9E9E9;
    color: #333333;
  }

  &.green-bg{
    width: 476rpx;
    height: 82rpx;
    background: $--ym-bg-primary;
    border-radius: 50px;
    color: #FFFFFF;
  }
}



</style>
