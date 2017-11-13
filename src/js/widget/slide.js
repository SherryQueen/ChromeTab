import { _, $, Storage } from '../common'
import Constant from '../constant'
let slideState = Constant.COLLAPSE

// 模块渲染
module.exports = function() {
	initEvents()
}

/**
 * 初始化事件
 */
function initEvents() {
	// 右下菜单
	$('.nav-menu-layout').on('click', 'a', e => {
		const url = e.target.getAttribute('data-url')
		// 如果是菜单
		if (_.isBlank(url)) {
			const nav = $('.nav-menu')[0]
			// 若为展开状态，则收缩侧边
			if (slideState !== Constant.COLLAPSE) {
				nav.classList.remove(Constant.COLLAPSE)
				showSlide(Constant.COLLAPSE)
			} else {
				// 若收缩 则展开为打开状态
				nav.classList.add(Constant.COLLAPSE)
				showSlide(Constant.OPEN)
			}
		} else
			// 如果是url
			// 获取当前标签 新打开一个标签
			chrome.tabs.getCurrent(tab =>
				chrome.tabs.create({
					index: tab.index + 1,
					active: true,
					pinned: false,
					url: url,
				}),
			)
	})

	// 菜单栏点击事件
	$('.slide-menu-item').on('click', function(e) {
		const index = parseInt(this.getAttribute('data-index'))
		showSlide(Constant.FULL_OPEN)

		const items = $('.slide-content-item')
		for (let i = 0, len = items.length; i < len; i++) {
			items[i].style.display = i === index ? 'block' : 'none'
		}
	})
}

/**
 * 显示侧边栏
 * @param  {Number} type 显示的状态
 */
function showSlide(type) {
	if (slideState === type) return
	slideState = type
	const slide = $('.slide-layout')[0],
		navMenu = $('.nav-menu-layout')[0],
		infoLayout = $('.info-layout')[0]
	switch (slideState) {
		case Constant.COLLAPSE:
			if (slide) {
				slide.classList.remove(Constant.OPEN)
				slide.classList.remove(Constant.FULL_OPEN)
			}
			if (navMenu) {
				navMenu.classList.remove(Constant.OPEN)
				navMenu.classList.remove(Constant.FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.classList.remove(Constant.OPEN)
				infoLayout.classList.remove(Constant.FULL_OPEN)
			}
			break
		case Constant.OPEN:
			if (slide) {
				slide.classList.add(Constant.OPEN)
				slide.classList.remove(Constant.FULL_OPEN)
			}
			if (navMenu) {
				navMenu.classList.add(Constant.OPEN)
				navMenu.classList.remove(Constant.FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.classList.add(Constant.OPEN)
				infoLayout.classList.remove(Constant.FULL_OPEN)
			}
			break
		case Constant.FULL_OPEN:
			if (slide) {
				slide.classList.remove(Constant.OPEN)
				slide.classList.add(Constant.FULL_OPEN)
			}
			if (navMenu) {
				navMenu.classList.remove(Constant.OPEN)
				navMenu.classList.add(Constant.FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.classList.remove(Constant.OPEN)
				infoLayout.classList.add(Constant.FULL_OPEN)
			}
			break
	}
}
