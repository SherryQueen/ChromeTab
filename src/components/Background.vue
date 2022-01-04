<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface IImage { url: string, copyright: string, copyrightlink: string, data: string }

const _cacheKey = 'bg-image'
const _imagePrefix = 'https://cn.bing.com'
const _defaultImage: IImage = { url: './assets/default.webp', data: './assets/default.webp', copyright: '', copyrightlink: '' }
const _cacheImage: IImage = JSON.parse((localStorage.getItem(_cacheKey) || JSON.stringify(_defaultImage)))

const image = ref<IImage>(_cacheImage)

const _imageToDataURL = (url: string): Promise<string> => fetch(url)
  .then(res => res.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

onMounted(async () => {
  try {
    const res = await fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN', { mode: 'no-cors', credentials: 'omit' })
      .then(res => res.json())

    const { url, copyright, copyrightlink } = res?.images[0] ?? { url: '', copyright: '', copyrightlink: '' }
    if (image.value.url === url) return

    const data = await _imageToDataURL(_imagePrefix + url)
    image.value = { url, data, copyright, copyrightlink }
    localStorage.setItem(_cacheKey, JSON.stringify(image.value))
  } catch (error) {
    console.error('error', error)
    image.value = _defaultImage
  }
})

</script>

<template>
  <div class="absolute bg-gray-300 w-screen h-screen">
    <div class="cover w-full h-full" style="z-index: -1;">
      <img v-if="!!image.url" :src="image.data" class="w-full h-full object-cover" />
    </div>
    <a :href="image.copyrightlink" target="_blank" rel="noopener noreferrer">
      <div class="absolute right-4 bottom-4 text-white">{{ image.copyright }}</div>
    </a>
  </div>
</template>

<style>
.cover::before {
  top: 0;
}
.cover::after {
  bottom: 0;
}
.cover::before,
.cover::after {
  position: absolute;
  content: "";
  width: 100%;
  height: 0;
  left: 0;
  box-shadow: 0 0 30px 15px #fff;
}
</style>
