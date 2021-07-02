import axios from 'axios'
import router from '../router'
import store from '../store'
import {ElMessage} from 'element-plus'

const serves = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
})
// 设置请求发送之前的拦截器
serves.interceptors.request.use(config => {
  // 统一在http请求的header都加上toke
  console.log()
  const token = store.state.vuex_token;
  token && (config.headers.Authorization = `Bearer ${token}`);
  console.log(store.state.vuex_token)
  return config
}, err => Promise.reject(err))

// 设置请求接受拦截器
serves.interceptors.response.use(res => {
  if (res.status === 200 || res.status === 204) {
    return res.data
  }
  if (res.status === 400) {
    //  执行静默登录操作
    ElMessage.error('请检查传入参数')
  }
  if (res.status === 401) {
    ElMessage.error('登录已过期,请重新登录!')
    // TODO: 应执行静默登录操作
    router.replace({path: '/login'});
  }
  if (res.status === 403) {
    // 403错误消息处理
    handle403(res)
  }
  if (res.status === 404) {
    // 403错误消息处理
    ElMessage.error('404错误')
  }
  // 设置接受数据之后，做什么处理
  if (res.status === 500) {
    ElMessage.error('服务端错误')
  }
}, err => {
  // 判断请求异常信息中是否含有超时timeout字符串
  if (err.message.includes('timeout')) {
    console.log('错误回调', err)
    ElMessage.error('网络超时')
  }
  if (err.message.includes('Network Error')) {
    console.log('错误回调', err)
    ElMessage.error('服务端未启动，或网络连接错误')
  }
  return Promise.reject(err)
})
// 处理403的提示
function handle403(res) {
  const message = res.data.error.message
  if (message) {
    // 存在message
    if (message.startsWith('Authorization failed!')) {
      // 无权限访问
      ElMessage.error('无权限访问')
    } else {
      // 正常message返回
      ElMessage.error(message)
    }
  } else {
    // 无message
    ElMessage.error( '403,无错误信息')
  }
}
// 将serves抛出去
export default serves
