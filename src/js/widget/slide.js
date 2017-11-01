import { _, $, Storage } from '../common'
const COLLAPSE = 'collapse',
	OPEN = 'open',
	FULL_OPEN = 'full-open'
let slideState = COLLAPSE

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
			if (slideState !== COLLAPSE) {
				nav.classList.remove(COLLAPSE)
				showSlide(COLLAPSE)
			} else {
				// 若收缩 则展开为打开状态
				nav.classList.add(COLLAPSE)
				showSlide(OPEN)
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
		showSlide(FULL_OPEN)

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
		case COLLAPSE:
			if (slide) {
				slide.classList.remove(OPEN)
				slide.classList.remove(FULL_OPEN)
			}
			if (navMenu) {
				navMenu.classList.remove(OPEN)
				navMenu.classList.remove(FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.classList.remove(OPEN)
				infoLayout.classList.remove(FULL_OPEN)
			}
			break
		case OPEN:
			if (slide) {
				slide.classList.add(OPEN)
				slide.classList.remove(FULL_OPEN)
			}
			if (navMenu) {
				navMenu.classList.add(OPEN)
				navMenu.classList.remove(FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.classList.add(OPEN)
				infoLayout.classList.remove(FULL_OPEN)
			}
			break
		case FULL_OPEN:
			if (slide) {
				slide.classList.remove(OPEN)
				slide.classList.add(FULL_OPEN)
			}
			if (navMenu) {
				navMenu.classList.remove(OPEN)
				navMenu.classList.add(FULL_OPEN)
			}
			if (infoLayout) {
				infoLayout.classList.remove(OPEN)
				infoLayout.classList.add(FULL_OPEN)
			}
			break
	}
}
