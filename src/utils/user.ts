import { getPersonIdentity, getEnterpriseIdentity } from '@/utils/subToken'

// 获取用户类型
async function getUserType (){
  let type = 0
  const personIdentity = await getPersonIdentity()
  const enterpriseIdentity = await getEnterpriseIdentity()
  !!personIdentity && (type = personIdentity.defaultRoleType)
  !!enterpriseIdentity && (type = enterpriseIdentity.defaultRoleType)
  return type
}

export { getUserType }