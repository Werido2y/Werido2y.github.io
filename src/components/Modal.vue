<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const { show, title } = defineProps<{
  show: boolean;
  title: string;
}>();

const emit = defineEmits(['close']);

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="emit('close')"></div>
      <div class="relative z-10 mx-auto mt-20 max-w-2xl bg-white rounded-lg shadow-xl">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">{{ title }}</h3>
            <button
              @click="emit('close')"
              class="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div class="overflow-y-auto max-h-[60vh]">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>