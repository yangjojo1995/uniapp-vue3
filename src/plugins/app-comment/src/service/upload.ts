import { request, uploadFile as uploadFileRequest } from '../lib/request'


/** 文件上传 */
export const uploadFile = (params: { filePath: string }) => {
  return uploadFileRequest(params)
}
