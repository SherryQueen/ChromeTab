/*
 * 背景设置相关
 * @Author: 56 
 * @Date: 2017-10-31 15:54:31 
 * @Last Modified by: 56
 * @Last Modified time: 2018-01-21 16:40:39
 */
import { _, $, Storage } from '../common'
import Constant from '../constant'

const defaultBg = {
	from: Constant.BG_FROM.LOCAL,
	title: '',
	interval: 0,
}

const locals = [
	'时间过得越久，人心的距离就越远。不过，偶尔也有例外。',
	'不能从外表去判断的，就像美丽的蔷薇也有刺一样。不过，也许里面也会有真的好人。',
	'就像汽水的自动贩卖机一样，放钱进去就能解渴，不放钱的话就什么也没有。金钱是买不到人心的。',
	'花是纤弱而短命的，即使维护起来，它们依然因喜恋阳光而枯萎，一旦暴风雨袭来，再金贵的栅栏也保护不了它们。',
	'对于一个死去的人，会以最美好的回忆永远留在心里，就像某人一样。',
	'就算什么都可以真实反映出来的镜子，也反映不出真正的你。',
	'再见是分离的时候带来针刺一样痛苦的悲哀的言语。',
]
let bgTitle, bgData, from
let timer

export const init = opt => {
	opt = opt || defaultBg
	bgInit(opt.from, opt)

	// 获取侧边选项
	const $bgForm = $(`input[name=bgFrom]`)
	const $bgTitle = $(`input[name=bgTitle]`)
	const $bgInterval = $(`input[name=bgInterval]`)

	// 初始化侧边选项的值
	$bgForm.checked(opt.from)
	$bgTitle.val(opt.title)
	$bgInterval.val(opt.interval)
	showCustom(opt.from)

	// 应用背景修改
	$('#backgroundApply').on('click', () => {
		const opt = {}
		opt.from = $bgForm.checked()
		if (opt.from === Constant.BG_FROM.CUSTOM) opt.title = $bgTitle.val()
		if (opt.from === Constant.BG_FROM.LOCAL) opt.interval = $bgInterval.val()
		if (opt.from === Constant.BG_FROM.CUSTOM) opt.bgData = bgData

		bgInit(opt.from, opt)
		Storage.saveConfig(Constant.BG_KEY, opt)
	})

	// 重置背景属性
	$('#backgroundReset').on('click', () => {
		$bgForm.checked(defaultBg.from)
		$bgTitle.val(defaultBg.title)
		$bgInterval.val(defaultBg.interval)

		showCustom(defaultBg.bgFrom)
		bgInit(defaultBg.from, defaultBg)
		Storage.saveConfig(Constant.BG_KEY, opt)
	})

	// 背景图片上传
	$('#bgUpload').on('change', evt => {
		const file = evt.target.files[0]
		if (/image\/w+/.test(file.type)) return alert('必须上传图片文件')

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = function() {
			bgData = this.result
			applyBackground(null, bgData)
		}
	})

	// 选择时切换显示内容
	$bgForm.on('change', evt => {
		let val = evt.target.value
		showCustom(val)
	})
}

/**
 * 设置图片展示
 * @param {String} bgFrom   图片来源
 * @param {Object} opt      其他一些参数
 */
function bgInit(bgFrom, opt) {
	from = bgFrom
	clearInterval(timer)

	// 根据选项初始化背景图片相关
	if (bgFrom === Constant.BG_FROM.CUSTOM) applyBackground(opt.title, opt.bgData)
	else {
		getImage()
		if (opt && opt.interval) timer = setInterval(getImage, opt.interval * 3600 * 1000) // 开启定时获取图片
	}
}

// 是否显示背景设置中的自定义设置
function showCustom(from) {
	const $upload = $('.bg-upload')
	const $introduce = $('.bg-introduce')
	const $interval = $('.bg-interval')
	if (from === Constant.BG_FROM.BING) {
		$upload.addClass('hidden')
		$introduce.addClass('hidden')
		$interval.addClass('hidden')
	} else if (from === Constant.BG_FROM.LOCAL) {
		$upload.addClass('hidden')
		$introduce.addClass('hidden')
		$interval.removeClass('hidden')
	} else {
		$upload.removeClass('hidden')
		$introduce.removeClass('hidden')
		$interval.addClass('hidden')
	}
}

/**
 * 获取图片
 */
async function getImage() {
	try {
		const resArr = await (from === Constant.BG_FROM.BING ? getImageFromBing() : getImageFromLocal())
		bgTitle = resArr[0]
		bgData = resArr[1]
	} catch (err) {
		const resArr = getImageFromLocal()
		bgTitle = resArr[0]
		bgData = resArr[1]
	}
	applyBackground(bgTitle, bgData)
}

/**
 * 随机获得照片
 */
function getImageFromLocal() {
	let ans = _.random(0, 6)
	return [locals[ans], `static/img/${ans}.jpg`]
}

/**
 * 从必应获取背景图片
 */
async function getImageFromBing() {
	try {
		console.log(_)
		const url = 'http://bing.com/HPImageArchive.aspx?format=js&n=1'
		const res = await _.http.get(url)

		// 处理必应的返回结果
		const images = res.images,
			len = images.length
		const image = images[0]
		let title = image.copyright,
			bgSrc = `http://cn.bing.com${image.url}`
		return [title, bgSrc]
	} catch (err) {
		console.error(err)
		return Promise.reject()
	}
}

/**
 * 应用背景设置
 * @param  {String} title 左下标题
 * @param  {String} bgSrc 背景图片
 */
function applyBackground(title, bgSrc) {
	if (title) $('.background-title').html(title)
	if (bgSrc) $('.background').css('backgroundImage', `url(${bgSrc})`)
}
