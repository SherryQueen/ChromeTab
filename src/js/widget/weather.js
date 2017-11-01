/*
 * 天气相关
 * @Author: 56 
 * @Date: 2017-11-01 19:47:55 
 * @Last Modified by: 56
 * @Last Modified time: 2017-11-01 19:58:50
 */
import { _, $, Storage } from '../common'
let clockEle
module.exports = function() {
  clockEle = $('#clock')[0]
	showWeather()
	showTime()

	setInterval(showTime, 30 * 1000) // 定时更新时间
	setInterval(showWeather, 5 * 60 * 1000) // 定时获取最新天气
}

/**
 * 显示时间
 */
function showTime() {
	clockEle.innerHTML = _.formDate(new Date(), 'hh:mm')
}

/**
 * 显示天气
 */
function showWeather() {
	const GaoDeURL = 'http://restapi.amap.com/v3/'
	const GaodeKey = 'f5a361c798795eca6d5968f9fb621916'

	_.http
		.get(`${GaoDeURL}ip`, { key: GaodeKey })
		.then(res => {
			const city = res.city,
				cityCode = res.adcode

			// 设置城市地址
			const cityEls = $('#city')
			cityEls[0].innerHTML = city
			return _.http.get(`${GaoDeURL}weather/weatherInfo`, { key: GaodeKey, city: cityCode })
		})
		.then(res => {
			const weather = res.lives[0].weather,
				weatherState = res.lives[0].temperature + '℃'

			const weatherNameEls = $('.weather-name'),
				weatherStateEls = $('.weather-state')

			weatherNameEls[0].innerHTML = weather
			weatherStateEls[0].innerHTML = weatherState
		})
		.catch(err => {
			console.error(err)
		})
}
