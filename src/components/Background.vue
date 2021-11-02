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
        .catch(err => console.error('Background:', err))
    })

    return { image }
  }

}

</script>

<template>
  <div class="absolute bg-gray-300 w-screen h-screen" style="z-index: -1;">
    <img v-if="!!image" :src="image" class="w-full h-full object-cover" />
  </div>
</template>
