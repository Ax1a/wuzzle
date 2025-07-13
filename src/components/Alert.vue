<template>
  <div v-if="isVisible" class="fixed z-40 transform -translate-x-1/2 left-1/2 top-10">
    <div
      class="py-3 text-center text-white bg-red-800 border-2 text-sm md:text-base border-red-700 min-w-[80vw] sm:min-w-min px-7 md:px-10 md:py-5 animate-shake animate-duration-300 rounded-xl"
    >
      Not in the word list.
    </div>
  </div>
</template>
<script setup>
  import { ref, defineExpose } from 'vue'
  const isVisible = ref(false)

  function showAlert() {
    isVisible.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 1500)
  }

  defineExpose({
    showAlert,
    isVisible
  })
</script>
<style lang=""></style>
