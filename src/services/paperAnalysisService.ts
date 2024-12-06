import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API endpoint

export interface PaperAnalysis {
  title: string;
  abstract: string;
  background: string;
  mindmap: {
    nodes: Array<{
      id: string;
      text: string;
      level: number;
      parent?: string;
    }>;
  };
}

export const analyzePaper = async (paperId: string): Promise<PaperAnalysis> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/papers/${paperId}/analysis`);
    return response.data;
  } catch (error) {
    console.error('Error analyzing paper:', error);
    // Return mock data for development
    return {
      title: 'Sample Paper Title',
      abstract: '这是一个示例论文摘要，描述了研究的主要内容和结果。',
      background: '这个研究背景部分阐述了该研究的重要性和必要性。研究表明，在当前领域中存在的问题和挑战需要新的解决方案。',
      mindmap: {
        nodes: [
          { id: '1', text: '论文主题', level: 0 },
          { id: '2', text: '研究背景', level: 1, parent: '1' },
          { id: '3', text: '研究方法', level: 1, parent: '1' },
          { id: '4', text: '实验结果', level: 1, parent: '1' },
          { id: '5', text: '现有问题', level: 2, parent: '2' },
          { id: '6', text: '解决方案', level: 2, parent: '2' },
          { id: '7', text: '数据收集', level: 2, parent: '3' },
          { id: '8', text: '数据分析', level: 2, parent: '3' },
          { id: '9', text: '准确率', level: 2, parent: '4' },
          { id: '10', text: '性能评估', level: 2, parent: '4' },
        ]
      }
    };
  }
};
