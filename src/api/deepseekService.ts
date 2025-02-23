import { DiagnosisResult } from '../types/diagnosis';
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Deepseek API配置
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

if (!DEEPSEEK_API_KEY) {
  console.error('Deepseek API key is not configured. Please check your .env file.');
}

// 配置axios实例
const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 配置重试机制
axiosRetry(axiosInstance, { 
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 重试间隔递增
  },
  retryCondition: (error) => {
    // 只在网络错误、幂等请求错误或服务器错误时重试
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           (error.response?.status ?? 0) >= 500;
  }
});

// 添加请求拦截器，用于日志记录
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.url);
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器，用于统一错误处理
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('响应错误:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查网络连接并重试');
      }
      if (!error.response) {
        throw new Error('无法连接到服务器，请检查网络连接');
      }
      if (error.response.status === 500) {
        throw new Error('服务器处理请求失败，请稍后重试');
      }
      throw new Error(error.response.data?.error || '请求失败，请稍后重试');
    }
    throw error;
  }
);

// 将图片转换为base64
const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // 移除Data URL前缀
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

// 构建提示词
const buildPrompt = (imageBase64: string) => {
  return {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "请分析这张皮肤病图片，判断是否为银屑病或特应性皮炎。请提供以下信息：\n1. 疾病类型（银屑病/特应性皮炎）\n2. 置信度（0-100%）\n3. 主要症状\n4. 严重程度（轻度/中度/重度）\n5. 治疗建议"
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ],
    model: "deepseek-vision-x-plus",
    max_tokens: 1000,
    temperature: 0.2,
    top_p: 0.9
  };
};

// 解析AI响应
const parseAIResponse = (response: any): DiagnosisResult => {
  const content = response.choices[0].message.content;
  
  // 使用正则表达式提取信息
  const diseaseMatch = content.match(/疾病类型[：:]\s*(银屑病|特应性皮炎)/);
  const confidenceMatch = content.match(/置信度[：:]\s*(\d+)%/);
  const symptomsMatch = content.match(/主要症状[：:]\s*([^\n]+)/);
  const severityMatch = content.match(/严重程度[：:]\s*(轻度|中度|重度)/);
  const recommendationsMatch = content.match(/治疗建议[：:]\s*([^\n]+)/);

  // 严重程度映射
  const severityMap: Record<string, 'mild' | 'moderate' | 'severe'> = {
    '轻度': 'mild',
    '中度': 'moderate',
    '重度': 'severe'
  };

  return {
    id: Date.now().toString(),
    disease: diseaseMatch ? 
      (diseaseMatch[1] === '银屑病' ? 'psoriasis' : 'eczema') : 
      'unknown',
    confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
    timestamp: new Date().toISOString(),
    imageUrls: [], // 图片URL将在上传后更新
    details: {
      symptoms: symptomsMatch ? 
        symptomsMatch[1].split('、').map((s: string) => s.trim()) : 
        [],
      severity: severityMatch ? 
        severityMap[severityMatch[1]] || 'moderate' : 
        'moderate',
      recommendations: recommendationsMatch ? 
        recommendationsMatch[1].split('。').filter(Boolean).map((s: string) => s.trim()) : 
        [],
      affectedAreas: []
    }
  };
};

export const deepseekService = {
  // AI诊断
  diagnose: async (image: File): Promise<DiagnosisResult> => {
    try {
      const imageBase64 = await imageToBase64(image);
      const requestBody = buildPrompt(imageBase64);

      const response = await axiosInstance({
        url: `${API_BASE_URL}/deepseek/chat`,
        method: 'POST',
        data: requestBody
      });
      
      return parseAIResponse(response.data);
    } catch (error) {
      console.error('AI诊断错误:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('未知错误，请稍后重试');
    }
  },

  // 批量AI诊断
  batchDiagnose: async (images: File[]): Promise<DiagnosisResult[]> => {
    return Promise.all(images.map(image => deepseekService.diagnose(image)));
  }
};
