/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */
!function () {
  document.querySelector('.login-wrap .btn').addEventListener('click', async e => {
    const form = document.querySelector('.login-form')
    const data = getFormData(form)

    try {
      const result = await axios({
        url: '/v1_0/authorizations',
        method: 'post',
        data
      })
      if (result.message === 'OK') {
        myAlert(true, '登录成功')
        localStorage.setItem('token', result.data.token)
        setTimeout(() => {
          location.replace('../content/index.html')
        }, 1500)
        //location.href = '../content/index.html'
      }
    } catch (error) {
      myAlert(false, error.response.data.message)
    }
  })
}()
