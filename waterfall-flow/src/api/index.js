//当前模块进行api统一管理
import mockRequests from './mockAjax'

export const reqGetImgList = () => mockRequests({
  url: '/imgList',
  method: 'get'
})