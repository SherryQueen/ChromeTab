import { _, $, Storage } from '../common'
import Constant from '../constant'
let slideState = Constant.COLLAPSE

// 模块渲染
export function init() {
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
			const $nav = $('.nav-menu')
			// 若为展开状态，则收缩侧边
			if (slideState !== Constant.COLLAPSE) {
				$nav.removeClass(Constant.COLLAPSE)
				showSlide(Constant.COLLAPSE)
			} else {
				// 若收缩 则展开为打开状态
				$nav.addClass(Constant.COLLAPSE)
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

		const items = $('.slide-content-item').dom()
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
	const slide = $('.slide-layout'),
		navMenu = $('.nav-menu-layout'),
		infoLayout = $('.info-layout')
	switch (slideState) {
		case Constant.COLLAPSE:
			if (slide) {
				slide.removeClass(Constant.OPEN)
				slide.removeClass(Constant.FULL_OPEN)
			}
			if (navMenu) {
				navMenu.removeClass(Constant.OPEN)
				navMenu.removeClass(Constant.FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.removeClass(Constant.OPEN)
				infoLayout.removeClass(Constant.FULL_OPEN)
			}
			break
		case Constant.OPEN:
			if (slide) {
				slide.addClass(Constant.OPEN)
				slide.removeClass(Constant.FULL_OPEN)
			}
			if (navMenu) {
				navMenu.addClass(Constant.OPEN)
				navMenu.removeClass(Constant.FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.addClass(Constant.OPEN)
				infoLayout.removeClass(Constant.FULL_OPEN)
			}
			break
		case Constant.FULL_OPEN:
			if (slide) {
				slide.removeClass(Constant.OPEN)
				slide.addClass(Constant.FULL_OPEN)
			}
			if (navMenu) {
				navMenu.removeClass(Constant.OPEN)
				navMenu.addClass(Constant.FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.removeClass(Constant.OPEN)
				infoLayout.addClass(Constant.FULL_OPEN)
			}
			break
	}
}
