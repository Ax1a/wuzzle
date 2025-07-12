<template>
  <div class="lg:max-w-[600px] max-w-[90vw] w-full">
    <div v-for="(keys, rowIdx) in keyGroups" :key="rowIdx" class="flex min-w-0 gap-1 mb-1">
      <button
        v-for="key in keys"
        :key="key"
        @click="$emit('keyPress', key)"
        :class="[
          'min-w-0 py-4 text-xs font-medium text-white transition-colors duration-200 rounded-lg cursor-pointer md:text-sm bg-slate-600 hover:bg-slate-700',
          rowIdx === 2 && (key === 'Backspace' || key === 'Enter') ? 'flex-[1.8]' : 'flex-1'
        ]"
      >
        <div v-if="key === 'Backspace' || key === 'Enter'" class="flex items-center justify-center">
          <Icon :icon="key === 'Backspace' ? 'bi:backspace' : 'bi:arrow-return-left'" width="18" height="18" />
        </div>
        <div v-else>
          {{ key }}
        </div>
      </button>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  const keyGroups = ref([
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Backspace', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter']
  ])
</script>
