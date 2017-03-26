(function (window) {
    const _ = {}

    function _addURLParam(url, name, value) {
        url += (url.indexOf('?') == -1 ? '?' : '&')
        url += encodeURIComponent(name) + '=' + encodeURIComponent(value)
        return url
    }

    _.ready = fn => {
        if (document.readyState !== 'loading') fn()
        else document.addEventListener('DOMContentLoaded', fn)
    }

    _.formDate = (date, formStr = 'yyyy-HH-dd hh:mm:ss') => {
        if (!(date instanceof Date)) return
        const res = formStr,
            year = date.getYear() % 100,
            month = date.getMonth() + 1,
            day = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            second = date.getSeconds()

        return res.replace('yyyy', date.getFullYear())
            .replace('yy', year > 9 ? year : `0${year}`)
            .replace('MM', month > 9 ? month : `0${month}`)
            .replace('dd', day > 9 ? day : `0${day}`)
            .replace('hh', hours > 9 ? hours : `0${hours}`)
            .replace('mm', minutes > 9 ? minutes : `0${minutes}`)
            .replace('ss', second > 9 ? second : `0${second}`)
    }

    const http = {}
    http.ajax = _ajax
    http.get = _get
    http.post = _post
    _.http = http

    function _ajax(params, data = {}) {
        return new Promise(function (resolve, reject) {
            let url = params.url
            const type = params.type ? params.type.toUpperCase() : 'GET',
                timeout = params.timeout ? params.timeout : 10000

            const _xhr = new XMLHttpRequest()
            if (type === 'GET') {
                for (let key of Object.keys(data)) {
                    url = _addURLParam(url, key, data[key])
                }
            } else if (type === 'POST') {

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

    window._ = _
})(window)
