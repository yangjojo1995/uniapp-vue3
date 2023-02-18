import { request } from '@/utils/request'

/** 协议 */
export const get = (params: { type: 0 | 1 | 2 | 3 | 4 }) => {
  return request.get('/public/commitment/signature/info', { params }) as Promise<{ id: string, content: string, type: string, version: string }>
}
