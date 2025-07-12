<template>
  <div v-if="visible" class="fixed z-50 flex items-center justify-center w-full h-full animate-duration-150 animate-fade drop-shadow-lg bg-black/50">
    <div
      class="flex flex-col justify-between p-10 text-center text-white border-2 md:min-h-[320px] min-h-[280px] min-w-[80vw] sm:min-w-[420px] animate-duration-300 animate-jump bg-slate-800 rounded-xl border-slate-700"
    >
      <template v-if="isCorrect">
        <h2 class="text-3xl font-bold text-teal-400 lg:text-4xl">Great Job!</h2>
        <h3 class="flex-1 mt-5 mb-10 text-xl lg:text-2xl">
          Guessed Word: <span class="italic font-bold">{{ props.word }}</span>
        </h3>
      </template>
      <template v-else>
        <h2 class="text-3xl font-bold text-red-400 lg:text-4xl">Try Again!</h2>
        <h3 class="flex-1 mt-5 mb-10 text-xl lg:text-2xl">
          The correct word was: <span class="italic font-bold">{{ word }}</span>
        </h3>
      </template>
      <div class="flex flex-row flex-wrap justify-center gap-4 text-sm md:text-lg">
        <button @click="$emit('newWord')" class="px-5 py-3 font-medium duration-200 bg-green-700 rounded-md hover:bg-green-800">New Word</button>
        <button @click="$emit('close')" class="px-5 py-3 font-medium duration-200 rounded-md bg-slate-900 hover:bg-slate-950">Close</button>
      </div>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps(['visible', 'word', 'isCorrect'])
  const emits = defineEmits(['close', 'newWord'])
</script>
