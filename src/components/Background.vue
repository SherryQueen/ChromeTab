<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface IImage { url: string; data: string }

const _cacheKey = 'bg-image'
const _imagePrefix = 'https://cn.bing.com'
const _defaultImage = { url: './assets/default.webp', data: './assets/default.webp' }
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
    const res = await fetch('https://cn.bing.com/hp/api/v1/imagegallery?format=json', { mode: 'no-cors', credentials: 'omit' })
      .then(res => res.json())

    const { highDef, ultraHighDef } = res.data?.images[0]?.imageUrls?.landscape ?? { highDef: undefined, ultraHighDef: undefined }
    if (image.value.url === highDef || image.value.url === ultraHighDef) return

    const res1 = await _imageToDataURL(_imagePrefix + highDef)
    image.value = { url: highDef, data: res1 }
    localStorage.setItem(_cacheKey, JSON.stringify(image.value))

    const res2 = await _imageToDataURL(_imagePrefix + ultraHighDef)
    image.value = { url: ultraHighDef, data: res2 }
    localStorage.setItem(_cacheKey, JSON.stringify(image.value))
  } catch (error) {
    image.value = _defaultImage
  }
})

</script>

<template>
  <div class="absolute bg-gray-300 w-screen h-screen" style="z-index: -1;">
    <div class="cover w-full h-full">
      <img v-if="!!image.url" :src="image.data" class="w-full h-full object-cover" />
    </div>
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
