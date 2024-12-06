<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Paper } from '../types/paper';

const props = defineProps<{
  paper: Paper;
}>();

const router = useRouter();

const navigateToPaperReview = () => {
  router.push({
    name: 'paper-review',
    params: { paperId: props.paper.id }
  });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
};

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};
</script>

<template>
  <div 
    @click="navigateToPaperReview"
    class="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-100"
  >
    <div class="absolute top-4 right-4 flex gap-2">
      <span 
        class="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
      >
        {{ paper.category }}
      </span>
      <span 
        v-if="paper.conference"
        class="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700"
      >
        {{ paper.conference }}
      </span>
    </div>

    <div class="space-y-4">
      <div>
        <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mt-2">
          {{ paper.title }}
        </h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ formatDate(paper.publishDate) }}
        </p>
      </div>

      <div class="space-y-3">
        <p class="text-gray-600 line-clamp-3">
          {{ truncateText(paper.abstract, 200) }}
        </p>

        <div class="flex flex-wrap gap-2">
          <span 
            v-for="(author, index) in paper.authors.slice(0, 3)" 
            :key="index"
            class="text-sm text-gray-600"
          >
            {{ author }}{{ index < Math.min(paper.authors.length - 1, 2) ? ',' : '' }}
          </span>
          <span v-if="paper.authors.length > 3" class="text-sm text-gray-500">
            +{{ paper.authors.length - 3 }} more
          </span>
        </div>
      </div>

      <div class="pt-4 flex items-center justify-between">
        <div class="flex items-center text-sm text-blue-600 font-medium">
          Read Analysis
          <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <a 
          v-if="paper.url"
          :href="paper.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-gray-500 hover:text-gray-700"
          @click.stop
        >
          View Original →
        </a>
      </div>
    </div>
  </div>
</template>