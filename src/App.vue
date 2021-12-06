<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Time from './components/Time.vue'
import Search from './components/Search.vue'
import Background from './components/Background.vue'

document.addEventListener('visibilitychange', () => {
  document.title = document.visibilityState === 'visible' ? '(*>.<*)被发现了' : '(*/ω＼*)你看不见我'
})

</script>

<template>
  <Background />
  <Search />
  <Time />
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
