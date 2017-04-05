(function (window) {
    const _ = {}

    _.ready = fn => {
        if (document.readyState !== 'loading') fn()
        else document.addEventListener('DOMContentLoaded', fn)
    }

    _.isBlank = str => {
        return !(str && str.trim().length !== 0)
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

    /** Ajax About start **/
    const http = {}
    http.ajax = _ajax
    http.get = _get
    http.post = _post
    _.http = http

    function _addURLParam(url, name, value) {
        url += (url.indexOf('?') == -1 ? '?' : '&')
        url += encodeURIComponent(name) + '=' + encodeURIComponent(value)
        return url
    }

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
    /** Ajax About end **/


    /** NodeList扩展 开始 **/
    window.$ = selector => {
        return document.querySelectorAll(selector)
    }
    const eventSet = new WeakSet()

    function getUniqID(eventName = '') {
        const res = `${eventName}${Math.random().toString(36).substr(2,10)}`
        return eventSet.has(res) ? getUniqID(eventName) : res
    }

    function evalDataSet(old, nd) {
        return old ? `${old}|${nd}` : nd
    }
    /** 委托实现 */
    NodeList.prototype.on = function (event, selector, fn) {
        const eid = getUniqID(event),
            self = Array.from(this)
        if (typeof (selector) === 'function') {
            fn = selector
            selector = ''
        }
        if (selector) {
            eventSet[eid] = e => {
                const els = $(selector),
                    obj = e.target
                let match
                for (let i = 0, len = els.length; i < len; i++) {
                    /** 点击对象即为委托对象 **/
                    if (obj.matches(selector)) {
                        fn(e)
                        e.stopPropagation()
                        return;
                    } else if (match = obj.closest(selector)) {
                        /** 委托对象为点击对象的祖父节点 **/
                        for (let j = 0; j < len; j++) {
                            if (els[j].contains(match)) {
                                fn(e)
                                e.stopPropagation()
                                return
                            }
                        }
                    }
                }
            }
        } else eventSet[eid] = fn

        /** 为元素绑定委托事件 **/
        for (let i = 0, len = self.length; i < len; i++) {
            const ele = self[i]
            if (!ele.dataSet) ele.dataSet = {}
            ele.dataSet[event] = evalDataSet(ele.dataSet[event], eid)
            ele.addEventListener(event, eventSet[eid])
        }
    }
    /** NodeList扩展 结束 **/

    window._ = _
})(window)
