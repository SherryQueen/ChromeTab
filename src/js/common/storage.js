/**
 * 设置存储
 * @param {String} key   键值
 * @param {String} value 存储值
 */
export function saveConfig(key, value) {
	return localStorage.setItem(key, value)
}

/**
 * 根据键值获取对应的值
 * @param {String} key 键值
 */
export function getConfig(key) {
	return localStorage.getItem(key)
}

/**
 * 删除键值
 * @param {String} key 键值
 */
export function removeConfig(key) {
	return localStorage.removeItem(key)
}
