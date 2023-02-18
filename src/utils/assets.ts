import CONFIG from '@/config'

export function assets (url: string, bucket = 'APP') {
  if (!url) return ''
  if (/^(?:https?:)?\/\//.test(url)) return url

  const base = CONFIG.ASSETS_BASE_URL

  if (base.indexOf('?') >= 0) {
    return base + url
  }
  return base.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
}

export default assets
