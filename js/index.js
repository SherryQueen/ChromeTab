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
                    alert('请求错误,请联系开发者')
                    console.err(err)
                }
            )
        },
        err => {
            alert('请求错误,请联系开发者')
            console.err(err)
        }
    )
}

/**
 * 初始化事件
 * @return {[type]} [description]
 */
function initEvents() {
    $('.bottom-right-layout').on('click', 'a', function (e) {
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
 * 初始化背景
 */
function initBackgroud() {
    /** 随机获取一直必应壁纸 **/
    const url = `http://bing.com/HPImageArchive.aspx?format=js&n=1&video=1`
    _.http.get(url).then(
        res => {
            const images = res.images,
                len = images.length
            const image = images[0]
            let videoUrl,
                title = image.copyright,
                bgUrl = `http://cn.bing.com${image.url}`
            $('.bottom-left-layout')[0].innerHTML = title
            const bgDiv = $('.background')[0]
            bgDiv.style.backgroundImage = `url(${bgUrl})`
            if (image.vid) {
                /** 如果有视频 **/
                const video = image.vid
                videoUrl = `http://cn.bing.com${video.sources[0][2]}`

                const videoDiv = document.createElement('video')
                videoDiv.setAttribute('src', videoUrl)
                videoDiv.setAttribute('preload', true)
                videoDiv.setAttribute('loop', 'loop')
                videoDiv.setAttribute('autoplay', 'autoplay')
                bgDiv.appendChild(videoDiv)
                timer = setInterval(() => {
                    chrome.tabs.getCurrent(tab => {
                        const videoObj = $('video')[0]
                        if (!videoObj) clearInterval(timer)
                        if (tab.active && videoObj.paused) videoObj.play()
                        else if (!tab.active && !video.paused) videoObj.pause()
                    })
                }, 800)
            }
        },
        err => {
            alert('请求错误,请联系开发者')
            console.err(err)
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
