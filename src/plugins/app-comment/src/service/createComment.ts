import { request } from '../lib/request'

// 添加评论
export const addComment = (params: any) => {
  return request.post('/front/comment/insert', params) as Promise<null>
}

// 获取点评配置
export const getScoreItem = () => {
  return request.get('/front/comment/score-item') as Promise<scoreItem>
}

// 我的点评列表
export const myCommentList = (params: any) => {
  return request.post('/front/comment/my-search', params) as Promise<CommentDetail>
}

// 我的点赞列表
export const myPraiseList = (params: any) => {
  return request.post('/front/comment/my-likes-search', params) as Promise<CommentLikesList>
}
