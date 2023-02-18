
import assets from '@/utils/assets'

// 预览图片
const previewImg = (url: string, urlArr: Array<string>) => {
  if(!url) return
  if(!urlArr || urlArr.length === 0){
    urlArr = [url]
  }
  url = assets(url + '?original=true')
  urlArr = urlArr.map((item: string) => {
    return  assets(item + '?original=true')
  })
  uni.previewImage({
    current: url,
    urls: urlArr
  })
}

export { previewImg }