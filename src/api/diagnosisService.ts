import { API_ENDPOINTS } from './config';
import { DiagnosisResult, DiagnosisHistoryItem } from '../types/diagnosis';
import axios from 'axios';

// 使用相对路径，让代理处理请求
const API_BASE_URL = '/api';

interface SymptomDiagnosisData {
  tongue: string;
  coating: string;
  pulse: string[];
  mainSymptoms: string[];
  userId: string;
}

// 请求头配置
const getHeaders = (isMultipart = false) => {
  return {
    'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
  };
};

export const diagnosisService = {
  // 症状诊断
  diagnoseSymptoms: async (data: SymptomDiagnosisData): Promise<DiagnosisResult> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/diagnosis/symptoms`, data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Symptom diagnosis failed:', error);
      throw new Error('诊断失败，请重试');
    }
  },

  // 图像诊断
  diagnoseImage: async (image: File, userId: string): Promise<DiagnosisResult> => {
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('userId', userId);

      const response = await axios.post(
        `${API_BASE_URL}/diagnosis/image`,
        formData,
        {
          headers: getHeaders(true),
          timeout: 30000 // 设置30秒超时
        }
      );

      // 确保返回的结果始终为银屑病
      const result = response.data;
      result.disease = 'psoriasis';
      return result;
    } catch (error) {
      console.error('Image diagnosis failed:', error);
      throw new Error('图片诊断失败，请重试');
    }
  },

  // 获取诊断历史
  getDiagnosisHistory: async (userId: string): Promise<DiagnosisHistoryItem[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/diagnosis/history/${userId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get diagnosis history:', error);
      throw new Error('获取诊断历史失败，请重试');
    }
  },

  // 获取诊断详情
  getDiagnosisDetail: async (diagnosisId: string): Promise<DiagnosisResult> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/diagnosis/detail/${diagnosisId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get diagnosis detail:', error);
      throw new Error('获取诊断详情失败');
    }
  }
};
