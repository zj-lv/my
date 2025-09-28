/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
const params = {
  status: '',
  channel_id: '',
  page: 1,
  per_page: 2
}
!function () {
  setchannels()
  showCardList(params)
}()
let total_count = 0
async function showCardList(params) {
  const result = await axios({
    url: '/v1_0/mp/articles',
    params
  })
  console.log(result)
  if (result.data.results.length === 0) {
    if (params.page > 1)
      params.page--
    return showCardList(params)
  }
  document.querySelector('.card .art-list').innerHTML = result.data.results.map(({ cover, title, status, pubdate, read_count, comment_count, like_count, id }) => {
    return `
    <tr>
      <td>
      <img src="${cover.images[0]}" alt="">
      </td>
      <td>${title}</td>
      <td>
        ${status === 1 ? `<span class="badge text-bg-primary">待审核</span>` : `<span class="badge text-bg-success">审核通过</span>`}
      </td>
      <td>
        <span>${pubdate}</span>
      </td>
      <td>
        <span>${read_count}</span>
      </td>
      <td>
        <span>${comment_count}</span>
      </td>
      <td>
        <span>${like_count}</span>
      </td>
      <td>
        <i class="bi bi-pencil-square edit" data-id=${id}></i>
        <i class="bi bi-trash3 del" data-id=${id}></i>
      </td>
    </tr>
    `
  }).join('')
  total_count = result.data.total_count
  document.querySelector('.page-now').innerHTML = `第${result.data.page}页`
  document.querySelector('.total-count').innerHTML = `共${total_count}条`
}
/**
 * 目标2：筛选文章列表ye
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
!function () {
  document.querySelector('.sel-btn').addEventListener('click', () => {
    const form = document.querySelector('.sel-form')
    const data = getFormData(form)
    console.log(data)
    params.page = 1
    params.status = data.status
    params.channel_id = data.channel_id

    showCardList(params)
  })

}()
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
!function () {
  document.querySelector('.next').addEventListener('click', e => {
    if (Math.ceil(total_count / params.per_page) > params.page) {
      params.page++
      showCardList(params)
    }

  })
  document.querySelector('.last').addEventListener('click', e => {
    if (params.page > 1) {
      params.page--
      showCardList(params)
    }

  })
}()
/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
document.querySelector('.art-list').addEventListener('click', e => {
  if (e.target.classList.contains('del')) {
    axios({
      url: `/v1_0/mp/articles/${e.target.dataset.id}`,
      method: 'delete'
    }).then(result => {
      console.log(result)
      showCardList(params)
    })
  }
})
// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
document.querySelector('.art-list').addEventListener('click', e => {
  if (e.target.classList.contains('edit')) {
    //edit_page(e.target.dataset.id)
    const pageId = e.target.dataset.id
    location.href = `../publish/index.html?id=${pageId}`
  }
})
