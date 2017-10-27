/*
 * Document 节点操作类
 * @Author: 56 
 * @Date: 2017-10-27 11:11:13 
 * @Last Modified by: 56
 * @Last Modified time: 2017-10-27 11:13:05
 */

const $ = selector => {
	return document.querySelectorAll(selector)
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
			const els = $(selector),
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
