import dayjs from 'dayjs'
// import 'dayjs/locale/zh-cn'
// import relativeTime from 'dayjs/plugin/relativeTime'

// dayjs.locale('zh-cn')
// dayjs.extend(relativeTime)

export function format (value: string | number | Date, template: string): string {
  return dayjs(value).format(template)
}

export function datetime (value: string | number | Date): string {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

export function date (value: string | number | Date): string {
  return dayjs(value).format('YYYY-MM-DD')
}

export function time (value: string | number | Date): string {
  return dayjs(value).format('HH:mm:ss')
}

export function fromNowLocal (datetime: string | number | Date): string {
  if (datetime === '' || datetime == null) return datetime

  const timestamp = dayjs(datetime).valueOf();
  
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const year = day * 365

  const now = dayjs().valueOf()
  const diff = now - timestamp

  const diffMinute = Math.floor(diff / minute)
  const diffHour = Math.floor(diff / hour)
  const diffDay = Math.floor(diff / day)
  // const diffMonth = Math.floor(diff / month)
  // const diffYear = Math.floor(diff / year)
  
  if (dayjs().subtract(1, 'day').format('YYYY-MM-DD') === dayjs(datetime).format('YYYY-MM-DD')) {
    return '昨天'
  }

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${diffMinute} 分钟前`
  } else if (diff < day) {
    return `${diffHour} 小时前`
  } else if (diff < month) {
    return dayjs(timestamp).format('MM月DD日')
  } else {
    return dayjs(timestamp).format('YYYY年MM月DD日')
  }
}

export default dayjs
