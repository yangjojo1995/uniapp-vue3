<template>
  <view class="chat-box" :style="styleData">
    <scroll-view class="chat-view" scroll-y :scroll-top="scrollTop" :scroll-with-animation="scrollWithAnimation" :scroll-anchoring="true" :bounces="false">
      <view class="chat-list">
        <view v-for="(item, index) in chatHistory" :key="item.id">
          <template v-if="item.type === 'text'">
            <view class="time" v-if="chatHistoryItemShowTime(item, index)">{{ fromNowLocal(item.createTime) }}</view>
            <view class="speak" :class="{ 'speak--own': item.source === identity.representativeId }">
              <image class="speak-user" mode="aspectFit" :src="assets(item.sourceIcon)" />
              <view class="speak-bubble">{{ item.content }}</view>
            </view>
          </template>
          <template v-else-if="item.type === 'connect-notify'">
            <view class="notify" v-if="showMessage">
              <text>点击授权</text>
              <text class="link" @click="requestSubscribeMessage">消息推送</text>
              ，您可以在微信上收到服务通知
            </view>
          </template>
        </view>
      </view>
    </scroll-view>
    <view class="chat-input">
      <input
        id="chat-input"
        class="chat-input__inner"
        v-model="chatMessage"
        confirm-type="send"
        cursor-spacing="12"
        :adjust-position="false"
        maxlength="500"
        @confirm="sendChat" />
      <view class="chat-input__bin" for="chat-input" @click.stop="sendChat">发送</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import socket from '@/utils/socketXctm'
import { fromNowLocal, format } from '@/utils/dayjs'
import { getIdentity } from '@/utils/subToken'
import assets from '@/utils/assets'
import { useConfig, useService } from '@/plugins/app-core'
const identity = ref()
const config = useConfig()
const service = useService()

// 联系人
const contactId = ref()
const contact = ref()
onLoad((params) => {
  contactId.value = params.contact
})

// 联系人详情
onShow(async () => {
  contact.value = await socket.getContact({ contact: contactId.value })
  uni.setNavigationBarTitle({ title: contact.value?.shortName || contact.value?.name  })
})

// 跳到底部
let scrollTop = ref(0)
let scrollWithAnimation = ref(true)
const toPageBottom = (duration: number = 100) => {
  scrollWithAnimation.value = duration > 0
  nextTick(() => {
    scrollTop.value = scrollTop.value >= 999999999 ? scrollTop.value + 1 : 999999999
    uni.pageScrollTo({
      scrollTop: 999999999,
      duration: duration
    })
  })
}

// 历史聊天记录
const chatHistory = reactive([] as any[])
const updatechatHistory = async () => {
  uni.showLoading({ title: '加载中' })
  try {
    const result = await socket.getChatHistory({ contact: contactId.value }) as any[]
    const list = result.sort((a, b) => a.createTime - b.createTime)
    if (list.length > 0) {
      list.push({
        type: 'connect-notify',
        createTime: list[list.length - 1].createTime
      })
    }
    chatHistory.splice(0, chatHistory.length, ...list)

    toPageBottom(0)

    // 上报已读
    await socket.readMessage({ contact: contactId.value })
  } catch (error) {
    console.error(error)
  }
  uni.hideLoading()
}
onLoad(() => socket.onOpen(updatechatHistory))
onUnload(() => socket.offOpen(updatechatHistory))

onShow(async () => {
  identity.value = await getIdentity()
  await updatechatHistory()
})

const chatHistoryItemShowTime = (item: any, index: number) => {
  if (index <= 0) return true
  return fromNowLocal(item.createTime) !== fromNowLocal(chatHistory[index - 1].createTime)
}

// 接收消息
const onChatMessage = async (result: any) => {
  const mine = identity.value.representativeId
  const he = contactId.value

  const mineToHe = result.source === mine && result.target === he
  const heToMine = result.source === he && result.target === mine
  const mineToMine = result.source === mine && result.target === mine

  if (mineToHe || heToMine || mineToMine) {
    chatHistory.push(result)
    if (chatHistory.length === 1) {
      chatHistory.push({
        type: 'connect-notify',
        createTime: result.createTime + 1
      })
    }

    toPageBottom(100)
    
    await socket.readMessage({ contact: contactId.value })
  }
}
onLoad(() => socket.onChatMessage(onChatMessage))
onUnload(() => socket.offChatMessage(onChatMessage))

// 发送消息
const chatMessage = ref('')
const chatMessageLoading = ref(false)
const sendChat = async () => {
  if (!chatMessage.value) return
  if (chatMessageLoading.value) return
  chatMessageLoading.value = true
  uni.showLoading({ title: '发送中' })
  try {
    await socket.sendChat({
      target: contactId.value,
      type: 'text',
      content: chatMessage.value
    })
    chatMessage.value = ''
  } catch (error) {
    console.error(error)
  }
  uni.hideLoading()
  chatMessageLoading.value = false
}

const uniLogin = function (options?: any): any {
  return new Promise((resolve, reject) => uni.login({ ...(options || {}), success: resolve, fail: reject }))
}
const uniRequestSubscribeMessage = function (options?: any): any {
  return new Promise((resolve, reject) => uni.requestSubscribeMessage({ ...(options || {}), success: resolve, fail: reject }))
}


const code = ref('')
onMounted(async () => {
  const loginResult = await uniLogin()
  // 获取 OpenId 失败
  if (!loginResult.code) return uni.showToast({ title: loginResult.errMsg, icon: 'none' })
  code.value = loginResult.code
})

const requestSubscribeMessageLoading = ref(false)
const showMessage = ref(true)
const requestSubscribeMessage = async () => {
  if (requestSubscribeMessageLoading.value) return
  requestSubscribeMessageLoading.value = true
  try {
    const result = await uniRequestSubscribeMessage({ tmplIds: [config.CHAT_NOTICE_TEMPLATE_ID] })
    const moIdState = result[config.CHAT_NOTICE_TEMPLATE_ID]
    if (moIdState === 'accept') {
      await service.message.wechatMsgAuth({ contactId: contactId.value, code: code.value })
      uni.showModal({ title: '提示', content: '您已成功开启消息推送，您可以收到消息通知', showCancel: false, confirmText: '知道了' })
    } else if (moIdState === 'reject') {
      uni.showToast({ title: '已取消消息推送', icon: 'none' })
    } else if (moIdState === 'ban') {
      uni.showToast({ title: '已被后台封禁消息推送', icon: 'none' })
    }
    showMessage.value = false
  } catch (error: any) {
    console.error(error);
    if(String(error.errCode) === '20004' ){
      return uni.showToast({ title: '消息推送授权失败，请在设置-通知管理中打开接收通知', icon: 'none', duration: 3000 })
    }else{
      return uni.showToast({ title: '消息推送授权失败', icon: 'none' })
    }
    // return uni.showToast({ title: error.errMsg || error.message, icon: 'none' })
  }
  requestSubscribeMessageLoading.value = false
}


const keyboardHeight = ref(0)
onLoad(async () => {
  uni.$on('keyboardHeightChange', (result) => {
    keyboardHeight.value = result.height
  })
})
onUnload(async () => {
  uni.$off('keyboardHeightChange')
})

const styleData = computed(() => {
  console.log(keyboardHeight.value);
  if (!keyboardHeight.value) return {}
  
  nextTick(() => nextTick(() => toPageBottom(0)))
  return {
    'height': `calc(100% - ${keyboardHeight.value}px)`,
    'padding-bottom': '0px'
  }
})
</script>

<style lang="scss">
page {
  min-height: auto;
}
</style>

<style lang="scss" scoped>
.chat-box {
  position: fixed;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #fff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  overflow: hidden;
  &::after {
    content: '';
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
    background-color: #fff;
  }
  .chat-view {
    background-color: #f7f6f9;
    flex-grow: 1;
    flex-shrink: 1;
    width: 100%;
    height: 100%;
    height: calc(100% - 128rpx)
  }
  .chat-input {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 128rpx;
    width: 100%;
    height: 128rpx;
    box-shadow: 0 0 10rpx #eeeeee;
  }
}

.chat-list {
  padding: 32rpx;
  width: 100%;
  box-sizing: border-box;
}

.speak {
  display: flex;
  margin-bottom: 32rpx;
  .speak-user {
    flex: 0 0 88rpx;
    display: block;
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background-color: #eeeeee;
    margin-right: 20rpx;
  }
  .speak-bubble {
    // flex: 1 1 auto;
    max-width: 100%;
    background: #FFFFFF;
    box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.06);
    border-radius: 10rpx 44rpx 44rpx 44rpx;
    padding: 28rpx;
    box-sizing: border-box;
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
    line-height: 1.5;
    word-break: break-word;
    white-space: pre-wrap;
  }

  &--own {
    flex-flow: row-reverse;
    .speak-user {
      margin-right: 0;
      margin-left: 20rpx;
    }
    .speak-bubble {
      margin-right: 0;
      margin-left: 20rpx;
      border-radius: 44rpx 44rpx 10rpx 44rpx;
      background-color: #00BA76;
      color: #ffffff;
    }
  }
}

.notify {
  width: 100%;
  background: #EEEEEE;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 400;
  color: #999999;
  line-height: 1.5;
  text-align: center;
  padding: 8rpx;
  margin-bottom: 32rpx;
}

.time {
  font-size: 24rpx;
  font-weight: 400;
  color: #999999;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 32rpx;
}

.link {
  color: #01BB77;
  cursor: pointer;
}

.chat-input {
  width: 100%;
  height: 128rpx;
  box-sizing: border-box;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
  display: flex;
  &__inner {
    flex: 1 1 auto;
    width: 100%;
    height: 80rpx;
    box-sizing: border-box;
    border: none;
    padding: 0 20rpx;
    margin: 0;
    background-color: #F7F7F7;;
    border-radius: 8rpx;
  }
  &__bin {
    flex: 0 0 150rpx;
    display: block;
    width: 150rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 8rpx;
    background-color: $--ym-color-primary;
    color: #ffffff;
    text-align: center;
    margin-left: 10px;
  }
}
</style>
 