// 引入自定义的css
import '../css/index.scss'
import { _, $, Storage } from './common'
import Constant from './constant'

import { init as bgInit } from './widget/background'
import { init as slideInit } from './widget/slide'

const defaultBg = {
	from: Constant.BG_FROM.LOCAL,
	title: '',
	interval: 0,
}

// 页面初始化
;(function init() {
	// 初始化侧边栏
	slideInit()

	// 读取配置 并进行初始化
	// 初始化背景配置
	const bg = Storage.getConfig(Constant.BG_KEY) || defaultBg
	bgInit(bg.from, bg)
	initBg(bg) // 初始化背景设置的侧边栏目
})()

/**
 * 根据配置来初始化右边选项
 * @param {Object} opt 对象 
 */
function initBg(opt) {
	setValue('bgFrom', opt.from)
	setValue('title', opt.title)
	setValue('bgInterval', opt.interval)

	// 应用背景修改
	$('#backgroundApply').on('click', () => {
		const opt = {}
		opt.from = getValue('bgFrom')
		opt.from = getValue('bgTitle')
		opt.interval = getValue('bgInterval')

		bgInit(opt.from, opt)
		Storage.saveConfig(Constant.BG_KEY, opt)
	})

	// 重置背景属性
	$('#backgroundReset').on('click', () => {
		setValue('bgFrom', defaultBg.from)
		setValue('title', defaultBg.title)
		setValue('bgInterval', defaultBg.interval)
		bgInit(defaultBg.from, defaultBg)
		Storage.saveConfig(Constant.BG_KEY, opt)
	})
}

/**
 * 设置input的值
 * @param {String} key input的name
 * @param {Number} val input的值
 */
function setValue(key, val) {
	val += ''
	const arr = $(`input[name=${key}]`)
	if (arr.length === 1) return (arr[0].value = val)
	else {
		for (let i = 0, len = arr.length; i < len; i++) if (arr[i].value === val) return arr[i].setAttribute('checked', 'checked')
	}
}

/**
 * 获得input的值
 * @param {String} key radio的name
 */
function getValue(key) {
	const arr = $(`input[name=${key}]`)
	if (arr.length === 1) return arr[0].value
	else for (let i = 0, len = arr.length; i < len; i++) if (arr[i].checked) return arr[i].value
}
