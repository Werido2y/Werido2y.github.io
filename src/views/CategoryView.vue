<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { categories } from '../data/papers';
import PaperCard from '../components/PaperCard.vue';
import SearchBar from '../components/SearchBar.vue';
import { useSearch } from '../composables/useSearch';

const route = useRoute();
const category = computed(() => {
  return categories.find(c => c.id === route.params.categoryId);
});

const currentPapers = computed(() => category.value?.papers || []);
const { filteredPapers, setSearchQuery, resetSearch } = useSearch(() => currentPapers.value);

// 监听类别变化，重置搜索
watch(() => route.params.categoryId, () => {
  resetSearch();
});

// 监听论文数据变化
watch(currentPapers, () => {
  resetSearch();
  setSearchQuery('');
}, { immediate: true });

const handleSearch = (query: string) => {
  setSearchQuery(query);
};

const getCategoryDescription = (categoryId: string) => {
  const descriptions: Record<string, string> = {
    'llm': 'Latest research in Large Language Models and Natural Language Processing',
    'cv': 'Cutting-edge developments in Computer Vision and Image Processing',
    'ai-safety': 'Research focusing on AI Safety, Ethics, and Responsible AI Development',
    'ai-applications': 'Practical applications and implementations of AI across various domains'
  };
  return descriptions[categoryId as string] || 'Explore the latest research papers in this category';
};
</script>

<template>
  <div v-if="category" class="space-y-8">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div class="max-w-3xl">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ category.name }}
        </h1>
        <p class="mt-2 text-gray-600">
          {{ getCategoryDescription(category.id) }}
        </p>
        <div class="mt-6">
          <SearchBar 
            @search="handleSearch" 
            class="max-w-xl"
            :placeholder="`Search in ${category.name}...`"
          />
        </div>
      </div>
    </div>

    <div v-if="filteredPapers.length > 0">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaperCard
          v-for="paper in filteredPapers"
          :key="paper.id"
          :paper="paper"
        />
      </div>
    </div>
    <div v-else class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <span class="text-2xl">🔍</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No papers found</h3>
      <p class="mt-2 text-gray-500">Try adjusting your search terms</p>
    </div>
  </div>
  <div v-else class="text-center py-12">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
      <span class="text-2xl">⚠️</span>
    </div>
    <h3 class="text-lg font-medium text-gray-900">Category not found</h3>
    <p class="mt-2 text-gray-500">Please select a valid category from the sidebar</p>
  </div>
</template>