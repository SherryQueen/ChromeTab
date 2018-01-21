// 引入自定义的css
import '../css/index.scss'
import { _, $, Storage } from './common'
import Constant from './constant'

import { init as bgInit } from './widget/background'
import { init as slideInit } from './widget/slide'

// 页面初始化
;(function init() {
	// 初始化侧边栏
	slideInit()

	// 读取配置 并进行初始化
	// 初始化背景配置
	const bg = Storage.getConfig(Constant.BG_KEY)
	bgInit(bg)
})()
