/**
 * 弹出确认框操作
 * operateName: 操作名，用于弹出提示框信息
 * operateApi()： 接口请求与处理方法，需要返回boolean
 * success()： 成功时的回调，即api()返回为真时的回调方法，参数为空则执行返回上页操作
 */
export const operateConfirm = async (
    operateName: string = '操作', operateApi: () => Promise<string>, success?: () => void
  ): Promise<void> => {
  uni.showModal({
    title: '提示',
    content: `确认${operateName}吗`,
    showCancel: true,
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({ title: `${operateName}中` })
        if( String(await operateApi()) === 'true') {
          uni.showToast({title: `${operateName}成功`});
          setTimeout(()=>{
            if(success){
              success()
            }else{
              uni.navigateBack({})
            }
          }, 1500)
        } else {
          uni.showToast({icon: 'none',title: `${operateName}失败，请稍后重试`});
        }
      }
    }
  })
}

export const inputConfirm = async (
  operateName: string = '操作', operateApi: (value: any) => Promise<string>, success?: () => void
): Promise<void> => {
uni.showModal({
  title: operateName,
  content: ``,
  editable: true,
  showCancel: true,
  success: async (res) => {
    if (res.confirm) {
      uni.showLoading({ title: `操作中` })
      if( String(await operateApi(res.content)) === 'true') {
        uni.showToast({title: `操作成功`});
        setTimeout(()=>{
          if(success){
            success()
          }else{
            uni.navigateBack({})
          }
        }, 1500)
      } else {
        uni.showToast({icon: 'none',title: `${operateName}失败，请稍后重试`});
      }
    }
  }
})
}

// 判断接口返回，结果为false时弹出失败提示
// 并将参数取反并返回（用于后接return）
export const errorCatch = (bool: boolean, message: string = '操作失败，请稍后重试') => {
  !bool && uni.showToast({
      title: message,
      icon: 'none'
    })
  return !bool
}

// 传入条件若为 false 则返回 true，并弹出一个 message 弹窗
// 一般用于表单校验时的语法糖，也可用于各种条件触发型弹窗
export const requireCheck = (msg: string, field: undefined | null | string | number| boolean = false) => {
  let flag = false
  if (field === false){
    flag = true
  }
  if (typeof field === 'string' && field === ''){
    flag = true
  }
  if (typeof field === 'number' && field === 0){
    flag = true
  }
  if (typeof field === undefined || typeof field === null){
    flag = true
  }
  if(flag){
    uni.showToast({
      title: msg,
      icon: 'none'
    })
    return true
  }else {
    return false
  }
}