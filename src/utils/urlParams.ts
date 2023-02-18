export default function urlParams (scene: string) {
  const str = decodeURIComponent(scene).replace('?', '&')
  let strArr = str.split('&')
  strArr = strArr.filter(item => item)
  const result = {} as { [key: string]: string }
  strArr.filter(item => {
    const key = item.split('=')
    result[key[0]] = key[1]
  })
  return result
}
