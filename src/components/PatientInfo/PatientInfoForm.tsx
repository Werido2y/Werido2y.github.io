import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { patientService, PatientInfo } from '../../api/patientService';
import { authService } from '../../api/authService';

export default function PatientInfoForm() {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    idNumber: '',
    birthDate: '',
    age: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    bloodType: '',
    allergyHistory: '',
    familyHistory: '',
    medicalHistory: '',
    chiefComplaint: '',
    presentIllness: '',
    medicationHistory: '',
    lifestyle: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 组件加载时检查登录状态并加载病人信息
  useEffect(() => {
    const loadLastPatientInfo = async () => {
      const currentUser = authService.getUser();
      if (currentUser) {
        const lastPatient = await patientService.getPatientByUserId();
        if (lastPatient) {
          setPatientInfo(lastPatient);
          toast.info('已加载最近保存的病人信息');
        }
      }
    };

    loadLastPatientInfo();
  }, []);

  // 当身份证号输入完成后，尝试加载已有病人信息
  useEffect(() => {
    const loadPatientInfo = async () => {
      if (patientInfo.idNumber.length === 18) {
        const existingPatient = await patientService.getPatient(patientInfo.idNumber);
        if (existingPatient) {
          setPatientInfo(existingPatient);
          toast.info('已加载该病人的历史信息');
        }
      }
    };

    loadPatientInfo();
  }, [patientInfo.idNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // ID number validation - only allow digits and X/x at the end
    if (name === 'idNumber') {
      // 只允许输入数字，且最后一位可以是X/x
      if (!/^[\d]*$/.test(value) && !(value.length === 18 && /^[\d]{17}[xX\d]$/.test(value))) {
        return;
      }
      // 限制长度不超过18位
      if (value.length > 18) {
        return;
      }
    }
    
    // Age auto-calculation from birthDate
    if (name === 'birthDate') {
      const birthYear = new Date(value).getFullYear();
      const currentYear = new Date().getFullYear();
      setPatientInfo(prev => ({
        ...prev,
        birthDate: value,
        age: String(currentYear - birthYear)
      }));
      return;
    }

    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    // 检查登录状态
    if (!authService.getUser()) {
      toast.error('请先登录');
      return false;
    }

    // 必填字段验证
    const requiredFields = ['name', 'idNumber', 'phone'];
    for (const field of requiredFields) {
      if (!patientInfo[field as keyof PatientInfo]) {
        toast.error(`请填写${field === 'name' ? '姓名' : field === 'idNumber' ? '身份证号' : '联系电话'}`);
        return false;
      }
    }

    // 身份证号格式验证
    if (!/^\d{17}[\dXx]$/.test(patientInfo.idNumber)) {
      toast.error('请输入正确的身份证号');
      return false;
    }

    // 手机号格式验证
    if (!/^1[3-9]\d{9}$/.test(patientInfo.phone)) {
      toast.error('请输入正确的手机号');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await patientService.savePatient(patientInfo);
      if (success) {
        toast.success('病人信息保存成功！');
      }
    } catch (error) {
      console.error('保存出错:', error);
      toast.error('保存失败，发生错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">病人基本信息</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              姓名
            </label>
            <input
              type="text"
              name="name"
              value={patientInfo.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              身份证号
            </label>
            <input
              type="text"
              name="idNumber"
              value={patientInfo.idNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="请输入18位身份证号码"
              maxLength={18}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              出生日期
            </label>
            <input
              type="date"
              name="birthDate"
              value={patientInfo.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              年龄
            </label>
            <input
              type="number"
              name="age"
              value={patientInfo.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              性别
            </label>
            <select
              name="gender"
              value={patientInfo.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              婚姻状况
            </label>
            <select
              name="maritalStatus"
              value={patientInfo.maritalStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">请选择</option>
              <option value="未婚">未婚</option>
              <option value="已婚">已婚</option>
              <option value="离异">离异</option>
              <option value="丧偶">丧偶</option>
            </select>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              联系电话
            </label>
            <input
              type="tel"
              name="phone"
              value={patientInfo.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              紧急联系人
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={patientInfo.emergencyContact}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              紧急联系电话
            </label>
            <input
              type="tel"
              name="emergencyPhone"
              value={patientInfo.emergencyPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              血型
            </label>
            <select
              name="bloodType"
              value={patientInfo.bloodType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">请选择</option>
              <option value="A">A型</option>
              <option value="B">B型</option>
              <option value="AB">AB型</option>
              <option value="O">O型</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>

        {/* 病史信息 */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              过敏史
            </label>
            <textarea
              name="allergyHistory"
              value={patientInfo.allergyHistory}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="药物、食物、环境等过敏情况"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              家族病史
            </label>
            <textarea
              name="familyHistory"
              value={patientInfo.familyHistory}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="直系亲属的重大疾病史"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              既往病史
            </label>
            <textarea
              name="medicalHistory"
              value={patientInfo.medicalHistory}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="既往重大疾病、手术史等"
            />
          </div>
        </div>

        {/* 中医专项 */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              主诉
            </label>
            <textarea
              name="chiefComplaint"
              value={patientInfo.chiefComplaint}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="主要症状和持续时间（例：反复头痛3个月，加重1周）"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              现病史
            </label>
            <textarea
              name="presentIllness"
              value={patientInfo.presentIllness}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="包括起病情况、主要症状特点、病情发展、诊治经过等"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md text-white ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-500'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? '保存中...' : '保存信息'}
          </button>
        </div>
      </form>
    </div>
  );
}
