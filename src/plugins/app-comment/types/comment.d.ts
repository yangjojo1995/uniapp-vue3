declare interface CommentList extends ListInterface{
  records: Array<CommentItem>
}

// 点赞的评论对象
declare interface commentObjInterface {
  id: string
  createByName: string
  createByIcon: string
  score: number
  bindObject: bindObject
  likeStatus: number
  pictureList: Array<string>
  createBy: string
  content: string
  pictures: string
  bindId: string
  bindType: string
  likes: number
  createTime: number
  updateTime: number
}

// 点赞列表
declare interface CommentLikesList extends ListInterface{
  records: Array<{
    id: string
    createByName: string
    createByIcon: string
    bindObject: bindObject
    commentObject: commentObjInterface
    commentTags: Array<commentTag>
    createTime: number
  }>
}

declare interface bindObject {
  bindId: string
  desc: string
  bindType: string
  bindTypeStr: string
}


// 评论标签
declare interface commentTag {
  id: string
  tagType: string
  name: string
  createTime: number
  commentId?: string
  bindId?: string
}

// 评分列表项
declare interface CommentScoringListItem {
  commentScoringItemId: string
  commentScoringItemName: string
  score: number
  createTime: number
  updateTime: number
}

// 点赞人列表项
declare interface CommentUsersItem {
  commentUserId: string
  commentUserName: string
  commentUserIcon: string
}

// 点评列表项
declare interface CommentItem {
  id: string
  createByName: string
  createByIcon: string
  score: number // 总评分
  likeStatus: number
  createBy: string
  userType: string
  content: string
  bindId: string
  bindType: string
  likes: number
  enable: string
  publisher: string
  createTime: number
  commentObject: commentObjInterface
  commentScoringList: Array<CommentScoringListItem> // 各项评分
  bindObject: bindObject
  likesUsers: {
    totle: number,
    commentUsers: Array<CommentUsersItem>
  }
  commentTags: Array<commentTag>
  pictureList: Array<string>
}

declare interface CommentDetail extends CommentItem{
  
}

// 点评配置
declare interface scoreItem {
  id: string
  name: string
  defaultValue?: number
  defaultShow?: number
  levelSysDictItem: scoreDictItem
}

// 评价等级字典项
declare interface scoreDictItem{
  id: string
  itemName: string
  itemValue: string
}