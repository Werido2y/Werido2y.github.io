<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search']);

const handleSearch = () => {
  emit('search', searchQuery.value);
};
</script>

<template>
  <div class="relative w-full max-w-md">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search papers..."
      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      @input="handleSearch"
    />
    <span class="absolute right-3 top-2.5 text-gray-400">
      🔍
    </span>
  </div>
</template>