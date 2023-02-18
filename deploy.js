const { parse, stringify, assign } = require('comment-json')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const minimist = require('minimist')
const miniprogramCi = require('miniprogram-ci')

const env = minimist(process.argv, {
  string: ['platform', 'appId', 'setVersion', 'configFile', 'privateKeyPath'],
  alias: {
    appId: 'appid',
    configFile: 'config-file',
    setVersion: 'set-version',
    privateKeyPath: 'private-key-path',
  },
  default: {
    platform: 'mp-weixin',
    configFile: './deploy.config.js',
    setVersion: '0.0.1',
    privateKeyPath: ''
  }
})

const config = require(env.configFile)
if (env.appId) {
  config.APPID = env.appId
} else if (!env.appId) {
  env.appId = config.APPID
  env.appid = config.APPID
}
if (!env.privateKeyPath) {
  env.privateKeyPath = `./private.${config.APPID}.key`
  env['private-key-path'] = `./private.${config.APPID}.key`
}

function editJson (filePath, callback) {
  backJson(filePath)
  const fileFullPath = path.join(__dirname, filePath)
  const fileBackupFullPath = path.join(__dirname, `${filePath}.backup`)
  fs.writeFileSync(fileBackupFullPath, fs.readFileSync(fileFullPath).toString())
  const json = parse(fs.readFileSync(fileFullPath).toString())
  const newJson = callback(json) || json
  fs.writeFileSync(fileFullPath, stringify(newJson, null, 2))
}

function backJson (filePath) {
  const fileFullPath = path.join(__dirname, filePath)
  const fileBackupFullPath = path.join(__dirname, `${filePath}.backup`)
  try {
    fs.accessSync(fileBackupFullPath, fs.constants.F_OK)
    fs.writeFileSync(fileFullPath, fs.readFileSync(fileBackupFullPath).toString())
    fs.unlinkSync(fileBackupFullPath)
  } catch (error) {}
}

editJson('/package.json', function (package) {
  package.version = env.setVersion
  return package
})

editJson('/src/config/config.build.json', function () {
  config.VERSION = env.setVersion
  return config
})

editJson('/src/manifest.json', function (manifest) {
  if (env.platform === 'mp-weixin') {
    manifest['mp-weixin'].appid = config.APPID
  }
  return manifest
})


execSync(`npm run build:${env.platform}`, { stdio: 'inherit' })

backJson('/package.json')
backJson('/src/config/config.build.json')
backJson('/src/manifest.json')

const project = new miniprogramCi.Project({
  appid: config.APPID,
  type: 'miniProgram',
  projectPath: './dist/build/mp-weixin',
  privateKeyPath: env.privateKeyPath,
  ignores: ['node_modules/**/*']
})

miniprogramCi.upload({
  project,
  version: env.setVersion,
  desc: (new Date()).toLocaleString(),
  robot: 1,
  setting: {
    es6: true,
    es7: true
  },
  onProgressUpdate: console.log
})
