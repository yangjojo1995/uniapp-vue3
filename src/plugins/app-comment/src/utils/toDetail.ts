
const toCompanyDetail = function (id: string, userType: string): void {
  let pathMap: any = {
    'institution': '/pages/organization/detail',
    'enterprise': '/pages/company/detail',
    'observer': '/pages/observer/detail',
    'manager': '/pages/manager/detail'
  }
  uni.navigateTo({ url: pathMap[userType] + '?id=' + id })
}

export { toCompanyDetail }