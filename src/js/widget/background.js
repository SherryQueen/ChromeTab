/*
 * 背景设置相关
 * @Author: 56 
 * @Date: 2017-10-31 15:54:31 
 * @Last Modified by: 56
 * @Last Modified time: 2017-11-01 21:00:47
 */
import { _, $ } from '../common'
import Constant from '../constant'

const locals = ['时间过得越久，人心的距离就越远。不过，偶尔也有例外。', '不能从外表去判断的，就像美丽的蔷薇也有刺一样。不过，也许里面也会有真的好人。', '就像汽水的自动贩卖机一样，放钱进去就能解渴，不放钱的话就什么也没有。金钱是买不到人心的。', '花是纤弱而短命的，即使维护起来，它们依然因喜恋阳光而枯萎，一旦暴风雨袭来，再金贵的栅栏也保护不了它们。', '对于一个死去的人，会以最美好的回忆永远留在心里，就像某人一样。', '就算什么都可以真实反映出来的镜子，也反映不出真正的你。', '再见是分离的时候带来针刺一样痛苦的悲哀的言语。']
let bgTitle, bgData, from
let timer

/**
 * 设置图片展示
 * @param {String} bgFrom   图片来源
 * @param {Object} opt      其他一些参数
 */
module.exports = (bgFrom, opt) => {
	from = bgFrom

	if (bgFrom === Constant.BG_FROM.CUSTOM) applyBackground(opt.bgTitle, opt.bgData)
	else {
		getImage()
		if (opt && opt.interval) {
			clearInterval(timer)
			timer = setInterval(getImage, opt.interval * 1000) // 开启定时获取图片
		}
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
	if (title) $('.background-title')[0].innerHTML = title
	if (bgSrc) $('.background')[0].style.backgroundImage = `url(${bgSrc})`
}
