<script setup lang="ts">
import { ref } from 'vue';
import { categories } from '../data/papers';
import { useRoute, useRouter } from 'vue-router';

const isOpen = ref(true);
const route = useRoute();
const router = useRouter();

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const navigateToCategory = (categoryId: string) => {
  router.push(`/category/${categoryId}`);
};

const getCategoryIcon = (categoryId: string) => {
  const icons: Record<string, string> = {
    'llm': '🤖',
    'cv': '👁️',
    'ai-safety': '🛡️',
    'ai-applications': '🔧'
  };
  return icons[categoryId] || '📄';
};

const getPaperCount = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId);
  return category?.papers.length || 0;
};
</script>

<template>
  <div class="relative">
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-20 p-2 bg-white/80 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
    >
      <span v-if="isOpen">←</span>
      <span v-else>→</span>
    </button>

    <div
      class="fixed left-0 top-0 h-full bg-white/80 backdrop-blur-md transition-all duration-300 border-r border-gray-200"
      :class="{ 'w-64': isOpen, 'w-0': !isOpen }"
    >
      <div class="pt-16 px-4" v-if="isOpen">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            AI Papers
          </h1>
        </div>
        
        <nav>
          <div class="space-y-1">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="navigateToCategory(category.id)"
              class="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              :class="{
                'bg-blue-50 text-blue-700 shadow-sm': route.params.categoryId === category.id,
                'hover:bg-gray-50': route.params.categoryId !== category.id
              }"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">{{ getCategoryIcon(category.id) }}</span>
                <span class="font-medium">{{ category.name }}</span>
              </div>
              <span 
                class="text-sm px-2 py-1 rounded-full"
                :class="{
                  'bg-blue-100 text-blue-700': route.params.categoryId === category.id,
                  'bg-gray-100 text-gray-600': route.params.categoryId !== category.id
                }"
              >
                {{ getPaperCount(category.id) }}
              </span>
            </button>
          </div>
        </nav>

        <div class="absolute bottom-8 left-4 right-4">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">
              AI Research Explorer
            </h3>
            <p class="text-xs text-gray-600">
              Discover the latest breakthroughs in AI research across multiple domains.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}
</style>