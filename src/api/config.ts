// API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API端点
export const API_ENDPOINTS = {
  // 诊断相关
  DIAGNOSE: `${API_BASE_URL}/diagnose`,
  GET_DIAGNOSIS_HISTORY: `${API_BASE_URL}/diagnosis/history`,
  
  // 用户相关
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // 病人信息相关
  PATIENT_INFO: `${API_BASE_URL}/patient/info`,
} as const;

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
