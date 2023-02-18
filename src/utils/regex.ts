import { number } from "@intlify/core-base"

export const isEmail =(email:any) =>{
  // const regex = /^\w+@[a-zA-Z0-9]+((\.[a-z0-9A-Z]{1,})+)$/
  const regex = /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,5}$/
  return  regex.test(email)
}
export const isPhone = (phone:any) => {
  const regex = /^1\d{10}$/
  return regex.test(phone)
}

export const isTelPhone = (phone:any) => {
  const regex = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
  return regex.test(phone)
}
export const isNumber = (number:any) => {
  const regex = /(^[1-9]\d*$)|(^[0-9]+.\d{1,2}$)/
  return regex.test(number)
}
export const isInit = (number:any) => {
  const regex = /(^[1-9]\d*$)/
  return regex.test(number)
}

// 密码为8-16位，至少包含字母/数字/符号2种组合
export const isPwd = (pwd: any) => {
  const regex = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,16}$/
  return regex.test(pwd)
}

// 账号为4~20个字母、数字、下划线或减号，以字母开头的字符串
export const isAccount = (str: any) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9_-]{3,19}$/
  return regex.test(str)
}