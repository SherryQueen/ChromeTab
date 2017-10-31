/*
 * 基于原生简单封装的请求扩展
 * @Author: 56 
 * @Date: 2017-10-27 11:09:04 
 * @Last Modified by: 56
 * @Last Modified time: 2017-10-31 15:31:56
 */
function _addURLParam(url, name, value) {
	url += url.indexOf('?') == -1 ? '?' : '&'
	url += encodeURIComponent(name) + '=' + encodeURIComponent(value)
	return url
}

function _ajax(params, data = {}) {
	return new Promise(function(resolve, reject) {
		let url = params.url
		const type = params.type ? params.type.toUpperCase() : 'GET',
			timeout = params.timeout ? params.timeout : 10000

		const _xhr = new XMLHttpRequest()
		if (type === 'GET') {
			for (let key of Object.keys(data)) {
				url = _addURLParam(url, key, data[key])
			}
		} else if (type === 'POST') {
			// TODO POST请求封装实现
		}

		_xhr.open(type, url, true)
		_xhr.timeout = timeout
		_xhr.onload = () => {
			if ((_xhr.status >= 200 && _xhr.status < 300) || _xhr.status == 304) resolve(JSON.parse(_xhr.response))
			else reject(_xhr.statusText)
		}
		_xhr.ontimeout = () => reject('请求超时')
		_xhr.onerror = () => reject('网络错误')
		_xhr.onabort = () => reject('请求取消')

		_xhr.send(type === 'GET' ? null : data)
	})
}

function _get(url, data) {
	const params = {}
	params['url'] = url
	params['type'] = 'GET'
	return _ajax(params, data)
}

function _post(url, data, params = {}) {
	params['url'] = url
	params['type'] = 'POST'
	return _ajax(params, data)
}

export default { get: _get, post: _post }
