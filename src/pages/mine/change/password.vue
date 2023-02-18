<template>
  <view class="content">
    <view class="form">

      <!-- 类型0 直接设置密码，要求用户此前未设置过密码 -->
      <template v-if="type==='0'">
        <view class="form-group">
          <view class="form-group-label label-required">设置登录密码</view>
          <view class="form-group-input">
            <input :password="ifPwd" placeholder="请输入新登录密码" @change="checkPwd" :maxlength="16" v-model="pwd" />
            <view class="icon-btn" @click="togglePwd(0)">
              <image v-if="ifPwd" src="../../../assets/mine/hide.png"></image>
              <image v-else src="../../../assets/mine/show.png"></image>
            </view>
          </view>
          <view v-if="openCheck && !pwdAccord" class="form-group-error">请输入8-16位，至少包含字母/数字/符号2种组合的密码</view>
        </view>
      </template>

      <!-- 类型1 通过验证码修改密码 -->
      <template v-if="type==='1'">
        <view class="form-group">
          <view class="form-group-label label-required">请输入验证码</view>
          <view class="form-group-input">
            <input placeholder="请输入验证码" :maxlength="6" v-model="code" style="width: 400rpx" />
            <view v-if="codeDown" class="code-btn white-btn">{{codeDown}}</view>
            <view v-else class="code-btn plain-btn" @click="handleSendCode">获取验证码</view>
          </view>
          <view class="form-group-error" v-if="openCheck && code == ''">请输入验证码</view>
          <view class="form-group-description" v-if="showMeg">
            <view v-if="userInfo.mobile">已发送至手机号{{userInfo.mobile}}</view>
            <view v-if="userInfo.email">已发送至邮箱{{userInfo.email}}</view>
          </view>
          <view class="form-group-description" v-if="!showMeg">
            点击发送验证码
          </view>
        </view>

        <view class="form-group">
          <view class="form-group-label label-required">请输入新登录密码</view>
          <view class="form-group-input">
            <input :password="ifPwd" placeholder="请输入新登录密码" @change="checkPwd" :maxlength="16" v-model="pwd" />
            <view class="icon-btn" @click="togglePwd(0)">
              <image v-if="ifPwd" src="../../../assets/mine/hide.png"></image>
              <image v-else src="../../../assets/mine/show.png"></image>
            </view>
          </view>
          <view v-if="openCheck && !pwdAccord" class="form-group-error">请输入8-16位，至少包含字母/数字/符号2种组合的密码</view>
        </view>
      </template>


      <!-- 类型2 通过原密码修改密码 -->
      <template v-if="type==='2'">
        <view class="form-group">
          <view class="form-group-label label-required">请输入原密码</view>
          <view class="form-group-input">
            <input :password="ifPwd1" placeholder="请输入原密码" :maxlength="16" v-model="oldPasswd" />
            <view class="icon-btn" @click="togglePwd(1)">
              <image v-if="ifPwd1" src="../../../assets/mine/hide.png"></image>
              <image v-else src="../../../assets/mine/show.png"></image>
            </view>
          </view>
          <view v-if="openCheck && !oldPasswd" class="form-group-error">请输入原密码</view>
        </view>

        <view class="form-group">
          <view class="form-group-label label-required">请输入新登录密码</view>
          <view class="form-group-input">
            <input :password="ifPwd" placeholder="请输入新登录密码" @change="checkPwd" :maxlength="16" v-model="pwd" />
            <view class="icon-btn" @click="togglePwd(0)">
              <image v-if="ifPwd" src="../../../assets/mine/hide.png"></image>
              <image v-else src="../../../assets/mine/show.png"></image>
            </view>
          </view>
          <view v-if="openCheck && !pwdAccord" class="form-group-error">请输入8-16位，至少包含字母/数字/符号2种组合的密码</view>
        </view>
      </template>


    </view>
    <view class="next-btn" @click="check">保存</view>
    <view class="link" @click="checkType">
      <text v-if="changeAble && type==='1'">通过原密码修改密码</text>
      <text v-if="changeAble && type==='2'">通过验证码修改密码</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, refType, onLoad, useService, operateConfirm, errorCatch } from '@/utils/commonUse'
import { userInterface } from '@/service/mine'
import { isPwd } from '@/utils/regex'
const service = useService()

// 密码设置类型： 0直接设置，1通过验证码设置，2通过原密码设置
let type: refType<string> = ref('loading')
let changeAble: refType<boolean> = ref(true)

// 判断用户密码类型，若未设置密码，则直接设置。若已设置密码，则通过两种方式修改
onLoad(async (props) => {
  type.value = props.statu || '0'
  if(type.value === '2'){
    changeAble.value = false
  }
})

// 用户信息，用于显示验证码提示信息
let userInfo: userInterface = reactive({id: '', userName: ''})
onLoad(async (props) => {
  const result: userInterface = await service.user.getCurrentUserInfo()
  Object.assign(userInfo, result)
})

// 密码显隐事件
let ifPwd: refType<boolean> = ref(true)
let ifPwd1: refType<boolean> = ref(true)
const togglePwd = (key: number): void => {
  if(key === 0){
    ifPwd.value = !ifPwd.value
  }else {
    ifPwd1.value = !ifPwd1.value
  }
}

// 验证码发送及倒计时
let showMeg: refType<boolean> = ref(false)
let codeDown: refType<number> = ref(0)
const handleSendCode = async (): Promise<void> => {
  showMeg.value = true
  let res: boolean = await service.mine.sendCode({template: 'reset-pwd'})
  if( errorCatch(res) ) return
  let num: number = 60
  countDown()
  function countDown(): void{
    codeDown.value = num
    num --
    codeDown.value > 0 && setTimeout(countDown, 1000);
  }
}

// 校验表单信息
let code: refType<string> = ref('')
let pwd: refType<string> = ref('')
let oldPasswd: refType<string> = ref('')
let openCheck: refType<boolean> = ref(false) // 是否开启表单校验
let pwdAccord: refType<boolean> = ref(false) // 密码校验是否通过
const checkPwd = (e: any): void => {
  pwdAccord.value = isPwd(e.detail.value)
}
const check = () => {
  pwdAccord.value = isPwd( pwd.value)
  openCheck.value = true
  switch (type.value) {
    case '0':
      if (!pwdAccord.value) return
      operateConfirm('设置密码', async () => {
        return await service.mine.updatePassword({ newPasswd: pwd.value })
      })
      break;
    case '1': 
      if (!code.value)  return
      if (!pwdAccord.value) return
      operateConfirm('修改密码', async () => {
        return await service.mine.setPassword({ code: code.value, password: pwd.value })
      })
      break;
    case '2':
      if (!oldPasswd.value)  return
      if (!pwdAccord.value) return
      operateConfirm('修改密码', async () => {
        return await service.mine.updatePassword({ oldPasswd: oldPasswd.value, newPasswd: pwd.value })
      })
      break;
    default: console.log('error type value'); break;
  }
}

// 切换页面类型
function initForm() {
  // 初始化表单数据
  oldPasswd.value = ''
  code.value = ''
  pwd.value = ''
  openCheck.value = false
  ifPwd.value = true
  ifPwd1.value = true
}
const checkType = () => {
  uni.showLoading({ title: '切换中...' })
  setTimeout(() => {
    initForm()
    type.value = type.value === '1'? '2' : '1'
    uni.hideLoading()
  }, 800);
}

</script>

<style lang="scss" scoped>
.content{
  background: #fff;
  padding: 64rpx;
  margin-top: 20rpx;
}

.form{
  .form-group{
    margin-bottom: 8rpx;
    overflow: hidden;
    height: 280rpx;

    .form-group-label{
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
      margin: 16rpx 0;
    }

    .form-group-input{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #F2F2F2;
      padding: 8rpx 0 4rpx;

      input{
        width: 100%;
        font-size: 12px;
      }
    }

    .form-group-error{
      color: #FF4536;
      font-size: 24rpx;
      margin: 12rpx 0;
    }

    .form-group-description{
      color: #999;
      font-size: 22rpx;
      margin: 12rpx 0;
    }
  }
}

.icon-btn {
  width: 64rpx;
  height: 64rpx;
  text-align: right;
  
  image{
    width: 48rpx;
    object-fit: cover;
    height: 32rpx;
  }
}

.code-btn {
  border-radius: 32px;
  width: 186rpx;
  height: 64rpx;
  font-size: 24rpx;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plain-btn{
  background: #EBF8EE;
  color: #00BA75;
  border-radius: 44rpx;
}

.white-btn{
  background: #fff;
  border: 2rpx solid #999;
  color: #999;
}

.next-btn{
  margin-top: 64rpx;
}

.link{
  font-size: 24rpx;
  margin: 64rpx 0 0;
  width: 100%;
  text-align: center;
  color: #01BB77;
}

</style>
