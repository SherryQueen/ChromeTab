/*
 * 自定义封装的工具类
 * @Author: 56 
 * @Date: 2017-10-26 17:25:10 
 * @Last Modified by: 56
 * @Last Modified time: 2017-11-01 19:58:22
 */
import http from './api'

const _ = {}
_.http = http

/**
 * DOM元素加载完毕后调用
 * @param {Function} cb 传入的回调方法
 */
_.ready = cb => {
	if (document.readyState !== 'loading') cb()
	else document.addEventListener('DOMContentLoaded', cb)
}

/**
 * 判断字符串是否为空
 * @param  {String} str 需要判断的字符串
 */
_.isBlank = str => !(str && str.trim().length !== 0)

/**
 * 格式化时间为目标字符串模板
 * @param {String|Object} date    时间戳或者时间对象
 * @param {String}        formStr 目标的格式化字符串
 */
_.formDate = (date, formStr = 'yyyy-HH-dd hh:mm:ss') => {
	date = date === 'string' ? new Date(date) : date
	const str = formStr,
		year = date.getYear() % 100,
		month = date.getMonth() + 1,
		day = date.getDate(),
		hours = date.getHours(),
		minutes = date.getMinutes(),
		second = date.getSeconds()

	return str
		.replace('yyyy', date.getFullYear())
		.replace('yy', year > 9 ? year : `0${year}`)
		.replace('MM', month > 9 ? month : `0${month}`)
		.replace('dd', day > 9 ? day : `0${day}`)
		.replace('hh', hours > 9 ? hours : `0${hours}`)
		.replace('mm', minutes > 9 ? minutes : `0${minutes}`)
		.replace('ss', second > 9 ? second : `0${second}`)
}

/**
 * 节流实现
 * @param  {Function} fn   执行的函数
 * @param  {Number}   wait 等待执行时间
 * @param  {Number}   must 必须执行时间
 */
_.throttle = (fn, wait, must) => {
	let last, timer
	return function() {
		// 获取上下文和参数
		let ctx = this,
			args = arguments

		const now = +new Date()
		// 定时回调执行的代码
		const cb = () => {
			last = now
			// 执行方法,设置原来的上下文 和 参数
			fn.apply(this, args)

			// 避免内存泄漏
			timer = null
			ctx = args = null
		}

		// 若上次调用未执行,且当前并非必须执行间隔,重新设置定时器
		if (last && now - last < must) {
			clearTimeout(timer)
			timer = setTimeout(cb, wait)
		} else
			// 若第一次调用
			// 若大于必须执行间隔
			cb()
	}
}

/**
 * 获取范围内的随机整数
 */
_.random = (min, max) => {
	return min + Math.floor(Math.random() * (max + 1 - min))
}

export default _
