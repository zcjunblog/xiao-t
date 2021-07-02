// 仅示例
import request from '@renderer/utils/request'

// export function login (data) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }

export function getLoginCode (miniProgramName) {
  return request({
    url: '/api/wechat-management/mini-programs/login/pc-login-acode',
    method: 'get',
    params: { miniProgramName }
  })
}
export function getLoginStatus (token) {
  return request({
    url: '',
    method: 'get',
    params: { token }
  })
}

export function message() {
  return request({
    url: '/message',
    method: 'get'
  })
}
