/**
 * 设置存储
 * @param {String} key   键值
 * @param {String} value 存储值
 */
export function saveConfig(key, value) {
	value = JSON.stringify(value)
	return localStorage.setItem(key, value)
}

/**
 * 根据键值获取对应的值
 * @param {String} key 键值
 */
export function getConfig(key) {
	let value = localStorage.getItem(key)
	try {
		return JSON.parse(value)
	} catch (error) {
		return value
	}
}

/**
 * 删除键值
 * @param {String} key 键值
 */
export function removeConfig(key) {
	return localStorage.removeItem(key)
}
