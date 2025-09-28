/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
setchannels()
/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
document.querySelector('.img-file').addEventListener('change', async e => {
  const fd = new FormData()
  fd.append('image', e.target.files[0])

  try {
    const result = await axios({ url: '/v1_0/upload', method: 'post', data: fd })

    document.querySelector('.rounded').src = result.data.url
    document.querySelector('.place').classList.add('hide')
    document.querySelector('.rounded').classList.add('show')

  } catch (error) {
    console.dir(error)
  }
})
document.querySelector('.rounded').addEventListener('click', () => {
  document.querySelector('.img-file').click()
})
/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
document.querySelector('.btn').addEventListener('click', async (e) => {
  if (e.target.innerHTML === '发布') {
    const form = document.querySelector('.art-form')
    const { title, content, channel_id } = getFormData(form)

    try {
      const images = [document.querySelector('.rounded').src]

      const result = await axios({
        url: '/v1_0/mp/articles',
        method: 'post',
        data: {
          title,
          content,
          cover: {
            type: images ? 1 : 0,
            images
          },
          channel_id
        }
      })
      if (result.data.id) {
        myAlert(true, '文章发布成功')

        form.reset()
        document.querySelector('.rounded').src = result.data.url
        document.querySelector('.place').classList.remove('hide')
        document.querySelector('.rounded').classList.remove('show')
        editor.setHtml()

        setTimeout(() => {
          location.href = '../content/index.html'
        }, 1500)
      }

    } catch (error) {
      console.dir(error)
      myAlert(false, error.response.data.message)
    }
  }

})
/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */
!function () {
  const paramsId = new URLSearchParams(location.search)
  console.log(paramsId)
  console.log(paramsId.get('id'))
  paramsId.forEach(async (value, key) => {
    if (key === 'id' && value) {
      document.querySelector('.title').innerHTML = '修改文章'
      document.querySelector('.send').innerHTML = '修改'
      const result = await axios({
        url: `/v1_0/mp/articles/${value}`
      })
      const data = result.data
      console.log(data)
      Object.keys(data).forEach(item => {
        // console.log(data[item])
        if (item === 'cover') {
          if (data[item].images[0]) {
            document.querySelector('.rounded').src = data[item].images[0]
            document.querySelector('.rounded').classList.add('show')
            document.querySelector('.place').classList.add('hide')
          }
        } else if (item === 'content') {
          editor.setHtml(data[item])
        } else {
          const box = document.querySelector(`[name="${item}"]`)
          box && (box.value = data[item])
        }
      })
    }
  })
}()
/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
document.querySelector('.btn').addEventListener('click', async (e) => {
  if (e.target.innerHTML === '修改') {
    const form = document.querySelector('.art-form')
    const { title, content, channel_id, id } = getFormData(form)

    try {
      const images = [document.querySelector('.rounded').src]

      const result = await axios({
        url: `/v1_0/mp/articles/${id}`,
        method: 'put',
        data: {
          id,
          title,
          content,
          cover: {
            type: images ? 1 : 0,
            images
          },
          channel_id
        }
      })
      if (result.data.id) {
        myAlert(true, '文章修改成功')
        setTimeout(() => {
          location.href = '../content/index.html'
        }, 1500)
      }
    } catch (error) {
      console.dir(error)
      myAlert(false, error.response.data.message)
    }
  }
})