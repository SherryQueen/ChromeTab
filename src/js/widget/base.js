/*
 * 基本配置相关
 * @Author: 56 
 * @Date: 2017-11-01 20:05:32 
 * @Last Modified by: 56
 * @Last Modified time: 2017-11-01 20:47:46
 */
import { _, $, Storage } from '../common'
const url = 'https://sslapi.hitokoto.cn/'

module.exports = function() {
	gethHitokoto()
}

/**
 * 从 hitokoto 获取一言
 * @Thanks
 */
function gethHitokoto() {
	_.http
		.get(url)
		.then(res => {
			let hitokoto = res.hitokoto
			let from = res.from
			let wordEls = $('#word')
			wordEls[0].innerHTML = `${hitokoto} --${from}`
		})
		.catch(err => console.error(err))
}
