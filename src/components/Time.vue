<script setup lang="ts">
import { ref, onMounted } from 'vue'

type INumberRender = [number, number, number, number, number, number, number]
type INumberRenders = [INumberRender, INumberRender, null, INumberRender, INumberRender, null, INumberRender, INumberRender]

const numberRender: INumberRender = [1, 1, 1, 1, 1, 1, 1] // l-t l-b r-t r-b top mid bottom
const numbers = ref<INumberRenders>
  ([numberRender, numberRender, null, numberRender, numberRender, null, numberRender, numberRender]) // h1 h2 colon m1 m2 colon s1 s2

const getTranslateX = (idx: number): number => {
  return [0, 40, 70, 90, 130, 160, 180, 220][idx]
}

const formatDateTime = (date: Date | string | number, format = 'YY/MM/DD HH:mm:ss') => {
  let d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) d = new Date()
  const y = d.getFullYear() + ''
  return format
    .replace(/Y+/g, (str: string) => (str.length <= 4 ? y.slice(4 - str.length) : y.padStart(str.length, '0')))
    .replace(/M+/g, (str: string) => (d.getMonth() + 1 + '').padStart(str.length, '0'))
    .replace(/D+/g, (str: string) => (d.getDate() + '').padStart(str.length, '0'))
    .replace(/H+/g, (str: string) => (d.getHours() + '').padStart(str.length, '0'))
    .replace(/m+/g, (str: string) => (d.getMinutes() + '').padStart(str.length, '0'))
    .replace(/s+/g, (str: string) => (d.getSeconds() + '').padStart(str.length, '0'))
    .replace(/S+/g, () => d.getMilliseconds() + '')
}

const mapNumberToNumberRender = (ans: string): INumberRender => {
  const map: Record<string, INumberRender> = {
    0: [1, 1, 1, 1, 1, 0, 1],
    1: [0, 0, 1, 1, 0, 0, 0],
    2: [0, 1, 1, 0, 1, 1, 1],
    3: [0, 0, 1, 1, 1, 1, 1],
    4: [1, 0, 1, 1, 0, 1, 0],
    5: [1, 0, 0, 1, 1, 1, 1],
    6: [1, 1, 0, 1, 1, 1, 1],
    7: [0, 0, 1, 1, 1, 0, 0],
    8: [1, 1, 1, 1, 1, 1, 1],
    9: [1, 0, 1, 1, 1, 1, 1],
  }
  return map[ans] || map[0]
}

const updateTime = () => {
  const [h, m, s]: string[] = formatDateTime(new Date(), 'HH:mm:ss').split(':')
  numbers.value = [mapNumberToNumberRender(h[0]), mapNumberToNumberRender(h[1]), null, mapNumberToNumberRender(m[0]), mapNumberToNumberRender(m[1]), null, mapNumberToNumberRender(s[0]), mapNumberToNumberRender(s[1])]
  requestAnimationFrame(updateTime)
}

onMounted(() => {
  requestAnimationFrame(updateTime)
})



</script>

<template>
  <div class="fixed right-4 top-4" style="transform:scale(0.5);margin-right:-70px">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="260px" height="60px">
      <template v-for="(n, idx) in numbers">
        <g v-if="n" :transform="`translate(${getTranslateX(idx)}, 0)`">
          <!-- l-t -->
          <polygon :fill="n[0] ? 'white' : 'transparent'" points="0 0 0 30 5 25 5 5" />
          <!-- l-b -->
          <polygon :fill="n[1] ? 'white' : 'transparent'" points="0 30 0 60 5 55 5 35" />
          <!-- r-t -->
          <polygon :fill="n[2] ? 'white' : 'transparent'" points="30 0 30 30 25 25 25 5" />
          <!-- r-b -->
          <polygon :fill="n[3] ? 'white' : 'transparent'" points="30 30 30 60 25 55 25 35" />
          <!-- top -->
          <polygon :fill="n[4] ? 'white' : 'transparent'" points="0 0 30 0 26 5 5 5" />
          <!-- mid -->
          <polygon
            :fill="n[5] ? 'white' : 'transparent'"
            points="0 30 5 27 25 27 30 30 25 33 5 33"
          />
          <!-- bottom -->
          <polygon :fill="n[6] ? 'white' : 'transparent'" points="0 60 30 60 25 55 5 55" />
        </g>
        <g v-else :transform="`translate(${getTranslateX(idx)}, 0)`">
          <circle cx="10" cy="20" r="3" fill="white" />
          <circle cx="10" cy="40" r="3" fill="white" />
        </g>
      </template>
    </svg>
  </div>
</template>
