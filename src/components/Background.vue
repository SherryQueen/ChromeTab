<script lang="ts">
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const image = ref('')

    onMounted(() => {
      fetch('https://cn.bing.com/hp/api/v1/imagegallery?format=json', { mode: 'no-cors', credentials: 'omit' })
        .then(res => res.json())
        .then(res => {
          image.value = `https://cn.bing.com${res.data?.images[0]?.imageUrls?.landscape?.highDef}`
          const img = new Image()
          img.src = `https://cn.bing.com${res.data?.images[0]?.imageUrls?.landscape?.ultraHighDef}`
          img.onload = () => image.value = img.src
          if (!image.value) throw new Error(`Unable to get wallpaper from bing`)
        })
        .catch(err => {
          console.error('Background:', err)
          image.value = './assets/deafult.webp'
        })
    })

    return { image }
  }

}

</script>

<template>
  <div class="absolute bg-gray-300 w-screen h-screen" style="z-index: -1;">
    <div class="cover w-full h-full">
      <img v-if="!!image" :src="image" class="w-full h-full object-cover" />
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
