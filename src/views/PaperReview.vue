<template>
  <div class="paper-review-container p-6">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="text-lg text-gray-600">正在分析论文...</div>
    </div>

    <div v-else-if="error" class="flex justify-center items-center min-h-[400px]">
      <div class="text-lg text-red-600">{{ error }}</div>
    </div>

    <template v-else>
      <h1 class="text-2xl font-bold mb-6">{{ paperInfo.title }}</h1>
      
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-3">摘要</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          {{ paperInfo.abstract }}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-3">研究背景</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          {{ paperInfo.background }}
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-3">思维导图</h2>
        <div class="bg-white shadow rounded-lg">
          <MindMap :nodes="paperInfo.mindmap.nodes" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { analyzePaper, type PaperAnalysis } from '../services/paperAnalysisService';
import MindMap from '../components/MindMap.vue';

const route = useRoute();
const paperInfo = ref<PaperAnalysis>({
  title: '',
  abstract: '',
  background: '',
  mindmap: {
    nodes: []
  }
});

const loading = ref(true);
const error = ref('');

const fetchPaperAnalysis = async () => {
  try {
    loading.value = true;
    error.value = '';
    const paperId = route.params.paperId as string;
    paperInfo.value = await analyzePaper(paperId);
  } catch (e) {
    error.value = '获取论文分析失败，请稍后重试';
    console.error('Error fetching paper analysis:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPaperAnalysis();
});
</script>

<style scoped>
.paper-review-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
