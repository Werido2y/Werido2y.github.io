import { ref, computed } from 'vue';
import type { Paper } from '../types/paper';

export function useSearch(papers: Paper[] | (() => Paper[])) {
  const searchQuery = ref('');
  
  const getPapers = () => {
    return typeof papers === 'function' ? papers() : papers;
  };

  const filteredPapers = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    const currentPapers = getPapers();
    
    if (!query) return currentPapers;

    return currentPapers.filter(paper => {
      return (
        paper.title.toLowerCase().includes(query) ||
        paper.abstract.toLowerCase().includes(query) ||
        paper.authors.some(author => author.toLowerCase().includes(query)) ||
        (paper.conference && paper.conference.toLowerCase().includes(query))
      );
    });
  });

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const resetSearch = () => {
    searchQuery.value = '';
  };

  return {
    filteredPapers,
    setSearchQuery,
    resetSearch
  };
}