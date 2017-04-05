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
 * 初始化加载
 */
_.ready(() => {
    showTime()
    showWeather()
    setInterval(showTime, 1000)
    setInterval(showWeather, 1000 * 60 * 5)

    initEvents()
    initOften()
})
