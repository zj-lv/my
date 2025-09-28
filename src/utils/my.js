//我的通用函数
async function setchannels() {
  const result = await axios({ url: '/v1_0/channels' })
  const formSelect = document.querySelector('.form-select')
  formSelect ? formSelect.innerHTML = '<option value="" selected="">请选择文章频道</option>' + result.data.channels.map(({ id, name }) => ` <option value="${id}">${name}</option>`).join('') : 0
}


function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries())
}

const fs = require('fs')

fs.writeFile('./text.txt', 'hello', err => {
  if (err) {
    console.log(err)
  } else
    console.log('exess')

})