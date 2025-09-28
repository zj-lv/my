// axios 公共配置
// 基地址
axios.defaults.baseURL = 'https://geek.itheima.net'

// 添加请求拦截器request
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 统一携带 token 令牌字符串在请求头上
  const token = localStorage.getItem('token')
  token && (config.headers.Authorization = `Bearer ${token}`)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器response
axios.interceptors.response.use(function (response) {
  // 在响应之前做些什么
  const { data } = response
  return data
}, function (error) {
  // 对响应错误做些什么
  //身份验证失败
  if (error?.response?.status === 401) {
    alert('身份验证过期，请重新登录')
    localStorage.clear()
    location.replace('../login/index.html')
  }
  return Promise.reject(error)
})