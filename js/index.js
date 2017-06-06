let bgData = ""

/**
 * 配置存储
 * @param  {[type]} key   [关键字]
 * @param  {[type]} value [对应的值]
 * @return {[type]}       [description]
 */
function saveConfig(key, value) {
    return localStorage.setItem(key, value)
}

/**
 * 获取配置
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function getConfig(key) {
    return localStorage.getItem(key)
}

/**
 * 显示时间
 * @return [type] [description]
 */
function showTime() {
    const clockEls = document.getElementsByClassName('clock')
    clockEls[0].innerHTML = _.formDate(new Date(), 'hh:mm')
}

/**
 * 显示天气
 * @return [type] [description]
 */
function showWeather() {
    const GaoDeURL = 'http://restapi.amap.com/v3/'
    const GaodeKey = 'f5a361c798795eca6d5968f9fb621916'

    _.http.get(`${GaoDeURL}ip`, {
        key: GaodeKey
    }).then(
        res => {
            const city = res.city,
                cityCode = res.adcode

            const cityEls = document.getElementsByClassName('city')
            cityEls[0].innerHTML = city

            _.http.get(`${GaoDeURL}weather/weatherInfo`, {
                key: GaodeKey,
                city: cityCode
            }).then(
                res => {
                    const weather = res.lives[0].weather,
                        weatherState = res.lives[0].temperature + '℃'

                    const weatherNameEls = document.getElementsByClassName('weather-name'),
                        weatherStateEls = document.getElementsByClassName('weather-state')

                    weatherNameEls[0].innerHTML = weather
                    weatherStateEls[0].innerHTML = weatherState
                },
                err => {
                    // alert('请求错误,请联系开发者')
                    console.err(err)
                }
            )
        },
        err => {
            // alert('请求错误,请联系开发者')
            console.err(err)
        }
    )
}

/**
 * 初始化事件
 * @return {[type]} [description]
 */
function initEvents() {
    /** 右下常用入口 **/
    $('.bottom-right-layout').on('click', 'a', e => {
        const url = e.target.getAttribute('data-url')
        if (_.isBlank(url)) {
            const nav = $('.nav-menu')[0]
            if (slideState) {
                nav.classList.remove('collapse')
                showSlide(0)
            } else {
                nav.classList.add('collapse')
                showSlide(1)
            }
        } else {
            chrome.tabs.getCurrent(tab => {
                chrome.tabs.create({
                    index: tab.index + 1,
                    active: true,
                    pinned: false,
                    url: url
                })
            })
        }
    })

    /** 侧边菜单项点击事件 **/
    $('.slide-menu-item').on('click', function(e) {
        const index = parseInt(this.getAttribute('data-index'))
        showSlide(2)

        const items = $('.slide-content-item')
        for (let i = 0, len = items.length; i < len; i++) {
            items[i].style.display = i === index ? 'block' : 'none'
        }
    })
}

/** 初始化经常访问页面 */
function initOften() {
    chrome.topSites.get(res => {
        res = res.splice(0, 5)
        const list = $('.bottom-layout')[0]
        res.forEach(item => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            const img = document.createElement('img')
            const title = document.createElement('div')

            li.classList.add('visited-item')
            li.setAttribute('title', item.title)

            a.setAttribute('href', item.url)

            img.setAttribute('src', `chrome://favicon/${item.url}`)

            title.innerHTML = item.title
            title.classList.add('visited-item-title')

            a.appendChild(img)
            a.appendChild(title)
            li.append(a)
            list.appendChild(li)
        })
    })
}

/**
 * 从Bing获取图片
 * @param  {Function} cb [回调函数]
 */
function fetchBing(cb) {
    const url = `http://bing.com/HPImageArchive.aspx?format=js&n=1&video=1`
    _.http.get(url).then(
        res => {
            const images = res.images,
                len = images.length
            const image = images[0]
            let title = image.copyright,
                bgSrc = `http://cn.bing.com${image.url}`
            cb(null, title, bgSrc)
        },
        err => {
            // alert('请求错误,请联系开发者')
            console.err(err)
            cb(err)
        })
}

/**
 * 应用背景设置
 * @param  {[type]} title [左下标题]
 * @param  {[type]} bgSrc [背景图片]
 * @return {[type]}       [description]
 */
function applyBackground(title, bgSrc) {
    if (title) $('.bottom-left-layout')[0].innerHTML = title
    if (bgSrc) $('.background')[0].style.backgroundImage = `url(${bgSrc})`
}

/**
 * 初始化背景
 */
function initBackgroud() {
    const backgroundTitle = getConfig("backgroundTitle")
    bgData = getConfig("backgroundSrc")
    if (backgroundTitle || bgData) applyBackground(backgroundTitle, bgData)
    else {
        // 获取Bing图片
        fetchBing((err, title, bgSrc) => {
            if (!err) applyBackground(title, bgSrc)
        })
    }

    /** 初始化自定义动作 */
    // 自定义图片上传
    $('#fileUpload').on('change', function() {
        const file = this.files[0]
        if (/image\/w+/.test(file.type)) return alert('必须上传图片文件')
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function() {
            bgData = this.result
            applyBackground(null, bgData)
        }
    })

    // 背景应用设置
    $('#backgroundApply').on('click', () => {
        const title = $('#backgroundText')[0].value.trim()
        applyBackground(title, null)
        saveConfig('backgroundTitle', title)
        saveConfig('backgroundSrc', bgData)
    })

    // 背景设置重置
    $('#backgroundReset').on('click', () => {
        fetchBing((err, title, bgSrc) => {
            if (!err) applyBackground(title, bgSrc)
        })
        saveConfig('backgroundTitle', '')
        saveConfig('backgroundSrc', '')
    })
}

/**
 * 显示侧边栏
 * @param  {[type]} type [0 关闭 1 显示菜单 2 全部展开]
 * @return {[type]}      [description]
 */
function showSlide(type) {
    if (slideState === type) return
    slideState = type
    const topRight = $('.top-right-layout')[0],
        bottomRight = $('.bottom-right-layout')[0],
        right = $('.right-layout')[0]

    switch (slideState) {
        case 0:
            topRight.classList.remove('open')
            topRight.classList.remove('full-open')
            bottomRight.classList.remove('open')
            bottomRight.classList.remove('full-open')
            right.classList.remove('open')
            right.classList.remove('full-open')
            break;
        case 1:
            topRight.classList.add('open')
            topRight.classList.remove('full-open')
            bottomRight.classList.add('open')
            bottomRight.classList.remove('full-open')
            right.classList.add('open')
            right.classList.remove('full-open')
            break;
        case 2:
            topRight.classList.remove('open')
            topRight.classList.add('full-open')
            bottomRight.classList.remove('open')
            bottomRight.classList.add('full-open')
            right.classList.remove('open')
            right.classList.add('full-open')
            break;
    }
}

let timer = null,
    slideState = 0
/**
 * 初始化加载
 */
_.ready(() => {
    showTime()
    showWeather()
    setInterval(showTime, 1000)
    setInterval(showWeather, 1000 * 60 * 5)

    initEvents()
    initOften()
    initBackgroud()
})
