<script lang="ts">
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const value = ref('')
    const motto = ref('我最喜欢的时光,就是和你在一起')
    const onSearch = () => {
      window.location.href = `https://cn.bing.com/search?q=${value.value}`
    }

    onMounted(() => {
      fetch('https://v1.hitokoto.cn/', { mode: 'no-cors', credentials: 'omit' })
        .then(res => res.json())
        .then(res => {
          const arr = []
          if (res.from_who && res.from_who !== 'null') arr.push(res.from_who)
          if (res.from !== 'null') arr.push(res.from)
          motto.value = `${res.hitokoto} -- ${arr.join('_')}`
        })
        .catch(err => console.error('Hitokoto:', err))
    })

    return { motto, value, onSearch, }
  }
}
</script>

<template>
  <div class="absolute top-1/3 text-white text-left" style="width: 400px;left: 15%">
    <h1 class="text-6xl">56のTab</h1>
    <h2 id="motto" class="text-xl">{{ motto }}</h2>
    <label class="block mt-2 -ml-4 text-xl border-none" for="search">
      <input
        :value="value"
        @keypress.enter="onSearch"
        @input="value = ($event.target as any).value"
        class="px-4 py-2 w-full rounded-full focus:outline-none text-gray-900"
        type="text"
        id="search"
        placeholder="Search Bing"
        autocomplete="off"
      />
    </label>
  </div>
</template>
