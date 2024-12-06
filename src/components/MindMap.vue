<template>
  <div class="mindmap-container">
    <div id="mindmap" class="mermaid"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import mermaid from 'mermaid';

const props = defineProps<{
  nodes: Array<{
    id: string;
    text: string;
    level: number;
    parent?: string;
  }>;
}>();

const generateMindMap = () => {
  const mindmapDefinition = ['mindmap'];
  
  // Helper function to add indentation
  const getIndentation = (level: number) => '  '.repeat(level);
  
  // Add root node
  const rootNode = props.nodes.find(node => node.level === 0);
  if (rootNode) {
    mindmapDefinition.push(`${getIndentation(1)}${rootNode.text}`);
    
    // Function to add child nodes recursively
    const addChildren = (parentId: string, level: number) => {
      const children = props.nodes.filter(node => node.parent === parentId);
      children.forEach(child => {
        mindmapDefinition.push(`${getIndentation(level + 1)}${child.text}`);
        addChildren(child.id, level + 1);
      });
    };
    
    addChildren(rootNode.id, 1);
  }
  
  return mindmapDefinition.join('\n');
};

const initMermaid = async () => {
  try {
    const element = document.getElementById('mindmap');
    if (element) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
      });
      
      const mindmapContent = generateMindMap();
      element.innerHTML = mindmapContent;
      await mermaid.run();
    }
  } catch (error) {
    console.error('Error initializing mindmap:', error);
  }
};

onMounted(() => {
  initMermaid();
});

watch(() => props.nodes, () => {
  initMermaid();
}, { deep: true });
</script>

<style scoped>
.mindmap-container {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
