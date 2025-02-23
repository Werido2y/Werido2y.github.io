import { toast } from 'react-toastify';
import { authService } from './authService';

export interface PatientInfo {
  name: string;
  idNumber: string;
  birthDate: string;
  age: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  bloodType: string;
  allergyHistory: string;
  familyHistory: string;
  medicalHistory: string;
  chiefComplaint: string;
  presentIllness: string;
  medicationHistory: string;
  lifestyle: string;
  userId?: string; // 关联的用户ID
  lastUpdated?: string; // 最后更新时间
}

class PatientService {
  private patients: Map<string, PatientInfo> = new Map();
  private STORAGE_KEY = 'medical_system_patients';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        Object.entries(parsed).forEach(([key, value]) => {
          this.patients.set(key, value as PatientInfo);
        });
      }
    } catch (error) {
      console.error('从存储加载病人数据失败:', error);
    }
  }

  private saveToStorage() {
    try {
      const data: { [key: string]: PatientInfo } = {};
      this.patients.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('保存到存储失败:', error);
      return false;
    }
  }

  async savePatient(patientInfo: PatientInfo): Promise<boolean> {
    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        toast.error('请先登录');
        return false;
      }

      if (!patientInfo.idNumber) {
        toast.error('缺少身份证号');
        return false;
      }

      // 添加用户ID和更新时间
      const updatedInfo = {
        ...patientInfo,
        userId: currentUser.id,
        lastUpdated: new Date().toISOString()
      };

      // 保存到内存
      this.patients.set(patientInfo.idNumber, updatedInfo);
      
      // 保存到存储
      const saved = this.saveToStorage();
      if (!saved) {
        toast.error('保存失败');
        return false;
      }

      toast.success('病人信息保存成功！');
      return true;
    } catch (error) {
      console.error('保存病人信息失败:', error);
      toast.error('保存失败，请重试');
      return false;
    }
  }

  async getPatientByUserId(): Promise<PatientInfo | null> {
    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        return null;
      }

      // 查找当前用户最后更新的病人信息
      const userPatients = Array.from(this.patients.values())
        .filter(patient => patient.userId === currentUser.id)
        .sort((a, b) => {
          const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return dateB - dateA;
        });

      return userPatients[0] || null;
    } catch (error) {
      console.error('获取用户病人信息失败:', error);
      return null;
    }
  }

  async getPatient(idNumber: string): Promise<PatientInfo | null> {
    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        return null;
      }

      const patient = this.patients.get(idNumber);
      if (patient && patient.userId === currentUser.id) {
        return patient;
      }
      return null;
    } catch (error) {
      console.error('获取病人信息失败:', error);
      return null;
    }
  }

  async getAllPatients(): Promise<PatientInfo[]> {
    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        return [];
      }

      // 只返回当前用户的病人信息
      return Array.from(this.patients.values())
        .filter(patient => patient.userId === currentUser.id)
        .sort((a, b) => {
          const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return dateB - dateA;
        });
    } catch (error) {
      console.error('获取病人列表失败:', error);
      return [];
    }
  }
}

export const patientService = new PatientService();
