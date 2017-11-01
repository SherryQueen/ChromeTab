// 引入自定义的css
import '../css/index.scss'

require('./widget/slide')()
require('./widget/background')()

/**
 * 设置 单选的值
 * @param {String} key radio的name
 * @param {Number} val radio的值
 */
function setRadio(key, val) {
	const arr = $(`input[name=${name}]`)
	val += ''
	for (let i = 0, len = arr.length; i < len; i++) if (arr[i].value === value) return arr[i].setAttribute('checked', 'checked')
}

/**
 * 获得单选的值
 * @param {String} key radio的name
 */
function getRadio(key) {
	const arr = $(`input[name=${name}]`)
	for (let i = 0, len = arr.length; i < len; i++) if (arr[i].checked) return arr[i].value
}
