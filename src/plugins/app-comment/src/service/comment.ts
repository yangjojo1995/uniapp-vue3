
import { request } from '../lib/request'

// 点评列表
export const getCommentList = (params: Partial<commentListParam>) => {
  return request.post('/front/comment/search', params) as Promise<CommentList>
}

// 点赞/取消点赞
export const like = (params: {status: boolean, commentId: string}) => {
  return request.post('/front/comment/like', params) as Promise<Array<CommentUsersItem>>
}

// 获取点评详情
export const getCommentDetail = (params: { id: string }) => {
  return request.get('/front/comment/info', { params }) as Promise<CommentDetail>
}

// 获取点赞列表
export const getLikeList = (params: {page: number, size: number, commentId: string, sortField?:string, asc?: boolean}) => {
  return request.post('/front/comment/likes-search', params) as Promise<CommentLikesList>
}