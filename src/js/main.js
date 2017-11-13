// 引入自定义的css
import '../css/index.scss'
import { _, $, Storage } from './common'
import Constant from './constant'

const bgInit = require('./widget/background')
;(function init() {
	// 读取配置 并进行初始化
	// 初始化背景配置
	const bg = Storage.getConfig(Constant.BG_KEY) || { form: Constant.BG_FROM.BING }
	bgInit(bg.from, bg)
})()

/**
 * 根据配置来初始化右边选项
 * @param {Object} opt 对象 
 */
function initBg(opt) {
	setRadio('BackgroundFrom', opt.from)
	$('#backgroundText')[0].innerTEXT = opt.bgTitle || ''
	$('#backgroundText')[0].innerTEXT = opt.bgTitle 

	$('#backgroundApply').on('click', ()=>{

	})

	$('#backgroundReset').on('click', ()=>{

	})
}

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
