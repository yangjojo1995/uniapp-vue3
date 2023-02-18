import buildConfig from './config.build.json'

interface BuildConfig { trial?: Record<string, any>, release?: Record<string, any> }

const config = {
  // 应用标题
  TITLE: '乡产投盟',

  // 请求接口 base url
  API_BASE_URL: 'https://gdxctm-dev.dreamkey.cn/business',
  // 文件上传 url （绝对路径）
  UPLOAD_FILE_URL: 'https://gdxctm-dev.dreamkey.cn/business/document/upload',
  // 签名上传
  UPLOAD_SIGNATURE_URL: 'https://gdxctm-dev.dreamkey.cn/business/front/user/upload/signature-image',
  // 资源路径 （云端图片、云端文件）
  ASSETS_BASE_URL: 'https://gdxctm-dev.dreamkey.cn',
  // 机构列表内嵌地图页
  ORG_MAP_URL: 'https://admin.gdxctm-dev.dreamkey.cn/orgMap.html',
  ORG_GRAPH_URL: 'https://admin.gdxctm-dev.dreamkey.cn/orgGraph.html',
  // WS 接口 base url
  WS_BASE_URL: 'wss://gdxctm-dev.dreamkey.cn/business',

  // 运营后台，资源路径，用于存放较大的图片资源
  ADMIN_ASSETS_URL: 'https://admin.gdxctm-dev.dreamkey.cn/app/',

  // 聊天通知模板ID
  CHAT_NOTICE_TEMPLATE_ID: 'I328VUqIjFfb4MThqul_HS8GqWgey3WvCMUmrKTFHwo',
}

Object.assign(config, buildConfig)

// #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-ALIPAY
const accountInfo = uni.getAccountInfoSync()
const env = accountInfo.miniProgram.envVersion || 'develop'
if (env === 'trial' && (buildConfig as BuildConfig).trial) {
  Object.assign(config, (buildConfig as BuildConfig).trial)
} else if (env === 'release' && (buildConfig as BuildConfig).release) {
  Object.assign(config, (buildConfig as BuildConfig).release)
}
// #endif

export default config
