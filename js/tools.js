(function(window) {
    const _ = {}

    /**
     * DOM元素加载完毕后调用
     * @param  {Function} fn [调用的方法]
     * @return {[type]}      [description]
     */
    _.ready = fn => {
        if (document.readyState !== 'loading') fn()
        else document.addEventListener('DOMContentLoaded', fn)
    }

    /**
     * 判断字符串是否为空
     * @param  {String}  str [字符串]
     * @return {Boolean}     [description]
     */
    _.isBlank = str => {
        return !(str && str.trim().length !== 0)
    }

    /**
     * 格式化时间
     * @param  {Date}   date                 [日期类]
     * @param  {String} [formStr='yyyy-HH-dd hh:mm:ss']    [格式化后的格式]
     * @return {[type]}                      [格式化后的结果]
     */
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

    /**
     * 节流实现
     * @param  {Function} fn   [执行的函数]
     * @param  {Number}   wait [等待执行时间]
     * @param  {Number}   must [必须执行时间]
     * @return {[type]}        [description]
     */
    _.throttle = function(fn, wait, must) {
        let last, timer
        return function() {
            // 获取上下文
            let ctx = this,
                args = arguments

            const now = +new Date()

            if (last && now - last < must) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    last = now
                    // 执行方法
                    fn.apply(this, args)

                    // 避免内存泄漏
                    timer = null
                    ctx = args = null
                }, wait)
            } else {
                last = now
                // 执行方法, 并清除定时器
                fn.apply(this, args)
                clearTimeout(timer)
                // 避免内存泄漏
                timer = null
                ctx = args = null
            }
        }
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
    /** Ajax About end **/


    /** NodeList扩展 开始 **/
    window.$ = selector => {
        return document.querySelectorAll(selector)
    }
    const eventSet = new WeakSet()

    /**
     * 获取事件唯一值
     * @param  {String} [eventName=''] [事件名]
     * @return {String}                [uniqID]
     */
    function getUniqID(eventName = '') {
        const res = `${eventName}${Math.random().toString(36).substr(2,10)}`
        return eventSet.has(res) ? getUniqID(eventName) : res
    }

    /**
     * 绑定事件
     * @param  {String} old [旧的绑定事件]
     * @param  {String} nd  [新的绑定事件]
     * @return {String}     [新的绑定事件结果]
     */
    function evalDataSet(old, nd) {
        return old ? `${old}|${nd}` : nd
    }

    /**
     * 委托实现
     * @param  {String}   event    [事件名]
     * @param  {String}   selector [选择器]
     * @param  {Function} fn       [执行的方法]
     * @return {[type]}            [description]
     */
    NodeList.prototype.on = function(event, selector, fn) {
        const eid = getUniqID(event),
            self = Array.from(this)
        if (typeof(selector) === 'function') {
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
                                fn.call(match, e)
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
