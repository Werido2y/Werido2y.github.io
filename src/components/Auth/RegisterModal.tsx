import React, { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (email: string, password: string, name: string, phone: string) => void;
}

interface RegisterForm {
  email: string;
  password: string;
  name: string;
  phone: string;
  confirmPassword: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });
  const [formattedPhone, setFormattedPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[2-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const trimmed = numbers.substring(0, 11);
    
    if (trimmed.length <= 3) {
      return trimmed;
    } else if (trimmed.length <= 7) {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    } else {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormattedPhone(formatted);
    
    const rawPhone = formatted.replace(/-/g, '');
    setForm(prev => ({ ...prev, phone: rawPhone }));
    
    if (rawPhone.length === 11) {
      if (!validatePhone(rawPhone)) {
        setPhoneError('请输入有效的手机号码');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    if (!validatePhone(form.phone)) {
      setPhoneError('请输入有效的手机号码');
      return;
    }
    
    onRegister(form.email, form.password, form.name, form.phone);
    onClose();
  };

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">用户注册</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formattedPhone}
                onChange={handlePhoneChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  phoneError ? 'border-red-500' : ''
                }`}
                placeholder="136-3634-4175"
                required
              />
              {formattedPhone && (
                <button
                  type="button"
                  onClick={() => {
                    setFormattedPhone('');
                    setForm(prev => ({ ...prev, phone: '' }));
                    setPhoneError('');
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">请输入11位中国大陆手机号</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700 transition-colors"
          >
            注册
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
