/*
 * Document 节点操作类
 * @Author: 56 
 * @Date: 2017-10-27 11:11:13 
 * @Last Modified by: 56
 * @Last Modified time: 2018-01-21 16:22:05
 */

// 初始化选择器 和 相关方法
function $(selector) {
	return new Doc(selector)
}

class Doc {
	// 构造函数
	constructor(selector) {
		this.docs = document.querySelectorAll(selector)
	}

	// 获取对应的dom元素对象
	dom(index) {
		return index !== undefined ? this.docs[index] : this.docs
	}

	// 获取当前得到dom元素数量
	len() {
		return this.docs.length || 0
	}

	// 获取或设置值
	val(val) {
		if (val !== undefined) this.docs.forEach(doc => (doc.value = val))
		else val = this.docs[0].value
		return val
	}

	// 设置对应的html代码
	html(html) {
		this.docs.forEach(doc => (doc.innerHTML = html))
	}

	// 设置css属性
	css(style, val) {
		this.docs.forEach(doc => (doc.style[style] = val))
	}

	// 绑定on方法 实现委托
	on(evt, selector, fn) {
		this.docs.on(evt, selector, fn)
	}

	// 根据值设置checked的值
	checked(val) {
		let doc
		if (val) {
			for (let i = 0, len = this.docs.length; i < len; i++) {
				doc = this.docs[i]
				if (doc.value === val) return doc.setAttribute('checked', 'checked')
			}
		} else {
			for (let i = 0, len = this.docs.length; i < len; i++) {
				doc = this.docs[i]
				if (doc.checked) return doc.value
			}
		}
	}

	addClass(cls) {
		this.docs.forEach(doc => doc.classList.add(cls))
	}

	removeClass(cls) {
		this.docs.forEach(doc => doc.classList.remove(cls))
	}
}

const eventSet = new WeakSet()

/**
 * 获取事件唯一值
 * @param  {String} [eventName=''] [事件名]
 * @return {String}                [uniqID]
 */
function getUniqID(eventName = '') {
	const res = `${eventName}${Math.random()
		.toString(36)
		.substr(2, 10)}`
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
	if (typeof selector === 'function') {
		fn = selector
		selector = ''
	}
	if (selector) {
		eventSet[eid] = e => {
			const els = $(selector).docs,
				obj = e.target
			let match
			for (let i = 0, len = els.length; i < len; i++) {
				/** 点击对象即为委托对象 **/
				if (obj.matches(selector)) {
					fn(e)
					e.stopPropagation()
					return
				} else if ((match = obj.closest(selector))) {
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

export default $
